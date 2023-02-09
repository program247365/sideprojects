use self::models::*;
use crate::db::establish_connection;
use diesel::prelude::*;
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
        id: domain.id.clone(),
        url: domain.url.clone(),
    };

    // println!("Inserting domain: {:?}", &new_domain);

    diesel::insert_into(domains)
        .values(new_domain)
        .execute(connection)
        .map(|_| domain)
}
