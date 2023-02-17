use self::models::*;
use crate::db::establish_connection;
#[cfg(test)]
use diesel::debug_query;
#[cfg(test)]
use diesel::insert_into;
use diesel::prelude::*;
use diesel::sqlite::Sqlite;
use sideprojects::*;

pub fn get_all_domains() -> Vec<Domain> {
    use self::schema::domains::dsl::*;
    let connection = &mut establish_connection();

    let results = domains
        .select((id, url))
        .limit(5)
        .load::<Domain>(connection)
        .unwrap();

    results
}

pub fn create_domain(
    domain: Domain,
) -> Result<sideprojects::models::Domain, diesel::result::Error> {
    use self::schema::domains::dsl::*;
    let connection = &mut establish_connection();

    let new_domain = Domain {
        id: None,
        url: domain.url,
    };
    // println!("Inserting domain: {:?}", &new_domain);

    diesel::insert_into(domains)
        .values(&new_domain)
        .execute(connection)
        .map(|_| new_domain)
}

#[test]
fn examine_sql_from_insert_default_values() {
    use schema::domains::dsl::*;

    let query = insert_into(domains).default_values();
    let sql = "INSERT INTO `domains` DEFAULT VALUES -- binds: []";
    assert_eq!(sql, debug_query::<Sqlite, _>(&query).to_string());
}
