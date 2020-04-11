const mongoose = require("mongoose");
const init_data = require("./init_data.json");

const RoleSchema = new mongoose.Schema({
  name: String,
  priority: Number,
});

RoleSchema.statics.init_data = () => {
  init_data.roles.map(role => {
    Role.findOne({name: role.name}).then(found_role => {
      if (!found_role) {
        const newRole = new Role({
          name: role.name,
          priority: role.priority,
        });
        newRole.save();
      }
    });
  });
};

RoleSchema.statics.get_id_by_role = role => {
  return Role.findOne({name: role}).then(role => {
    if (role) {
      return Promise.resolve(role.id);
    } else {
      Promise.reject("role not found");
    }
  });
};

const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;
