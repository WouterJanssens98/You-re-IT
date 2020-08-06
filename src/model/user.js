export default class User {
  constructor({
    name, email, role, picture, location,
  }) {
    this.name = name;
    this.email = email;
    this.role = role;
    this.picture = picture;
    this.location = location;
  }
}
