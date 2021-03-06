import { injectable } from "inversify";
import { DB } from "../apiBase/db";
import { Campus } from "../models";
import { UniqueIdHelper } from "../helpers";

@injectable()
export class CampusRepository {

  public async save(campus: Campus) {
    if (UniqueIdHelper.isMissing(campus.id)) return this.create(campus); else return this.update(campus);
  }

  public async create(campus: Campus) {
    campus.id = UniqueIdHelper.shortId();
    return DB.query(
      "INSERT INTO campuses (id, churchId, name, address1, address2, city, state, zip, removed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0);",
      [campus.id, campus.churchId, campus.name, campus.address1, campus.address2, campus.city, campus.state, campus.zip]
    ).then(() => { return campus; });
  }

  public async update(campus: Campus) {
    return DB.query(
      "UPDATE campuses SET name=?, address1=?, address2=?, city=?, state=?, zip=? WHERE id=? and churchId=?",
      [campus.name, campus.address1, campus.address2, campus.city, campus.state, campus.zip, campus.id, campus.churchId]
    ).then(() => { return campus });
  }

  public async delete(churchId: string, id: string) {
    DB.query("UPDATE campuses SET removed=1 WHERE id=? AND churchId=?;", [id, churchId]);
  }

  public async load(churchId: string, id: string) {
    return DB.queryOne("SELECT * FROM campuses WHERE id=? AND churchId=? AND removed=0;", [id, churchId]);
  }

  public async loadAll(churchId: string) {
    return DB.query("SELECT * FROM campuses WHERE churchId=? AND removed=0;", [churchId]);
  }

  public convertToModel(churchId: string, data: any) {
    const result: Campus = { id: data.id, name: data.name, address1: data.address1, address2: data.address2, city: data.city, state: data.state, zip: data.zip, importKey: data.importKey };
    return result;
  }

  public convertAllToModel(churchId: string, data: any[]) {
    const result: Campus[] = [];
    data.forEach(d => result.push(this.convertToModel(churchId, d)));
    return result;
  }

}
