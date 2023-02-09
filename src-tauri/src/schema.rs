// @generated automatically by Diesel CLI.

diesel::table! {
    domains (id) {
        id -> Nullable<Integer>,
        url -> Nullable<Text>,
    }
}
