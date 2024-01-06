import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists menu (id integer primary key not null, name text, price text, description text, image text, category text);'
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from menu', [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export async function insertAllDishes(menuItems) {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        menuItems.forEach((item) => {
          tx.executeSql('insert into menu (name, price, description, image, category) values (?,?,?,?,?)', [item.name, item.price.toFixed(2), item.description, item.image, item.category]);
        });
      },
      reject,
      resolve
    );
  });
 };


export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    if (!query) {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from menu where ${activeCategories
            .map((category) => `category='${category}'`)
            .join(' or ')}`,
          [],
          (_, { rows }) => {
            resolve(rows._array);
          }
        );
      }, reject);
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from menu where (name like '%${query}%') and (${activeCategories
            .map((category) => `category='${category}'`)
            .join(' or ')})`,
          [],
          (_, { rows }) => {
            resolve(rows._array);
          }
        );
      }, reject);
    }
  });
}

export async function deleteAllDishes() {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql('delete from menu');
      },
      reject,
      resolve
    );
  });
 };

 export function deleteMenuTable() {
  db.transaction(
   (tx) => {
   		tx.executeSql('drop table if exists menu')
   }
)
}
