use self::models::*;
use crate::db::establish_connection;
use diesel::prelude::*;
use sideprojects::*;

/*
pub fn get_all_domains() -> DomainsQueryResult {
    let mut connection = establish_connection();

    let sql_domains = "
    SELECT
      id,
      url
    FROM domains
  ";

    let domains = diesel::sql_query(sql_domains)
        .load::<DomainsQuery>(&mut connection)
        .unwrap_or(vec![]);

    println!("{:?}", domains);

    DomainsQueryResult { list: domains }
}
*/

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
