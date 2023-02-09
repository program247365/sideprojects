#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

extern crate diesel;
extern crate diesel_migrations;
extern crate dotenv;

mod db;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
mod domains;
use std::env;
use tauri::Manager;
use tauri::SystemTray;
use tauri::{CustomMenuItem, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");
use serde::{ser::Serializer, Serialize};

// fixed: https://github.com/tauri-apps/tauri/discussions/3913
// create the error type that represents all errors possible in our program
#[derive(Debug, thiserror::Error)]
pub enum CommandError {
    #[error(transparent)]
    IoError(#[from] std::io::Error),
}

// we must manually implement serde::Serialize
impl Serialize for CommandError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub type CommandResult<T, E = CommandError> = anyhow::Result<T, E>;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_domains() -> Result<Vec<sideprojects::models::Domain>, String> {
    let result = domains::get_all_domains();

    Ok(result)
}

#[tauri::command]
fn insert_domain(
    domain: sideprojects::models::Domain,
) -> Result<sideprojects::models::Domain, String> {
    match domains::create_domain(domain) {
        Ok(new_domain) => Ok(new_domain),
        Err(error) => Err("Error inserting domain".to_string() + error.to_string().as_str()),
    }
}

fn main() {
    let mut connection = db::establish_connection();
    connection
        .run_pending_migrations(MIGRATIONS)
        .expect("Error migrating SQLite database!");

    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let tray_menu = SystemTrayMenu::new()
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "hide" => {
                    let window = app.get_window("main").unwrap();
                    window.hide().unwrap();
                }

                _ => {}
            },
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![greet, get_domains, insert_domain])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        });
}
