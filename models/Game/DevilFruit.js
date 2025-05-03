// models/DevilFruit.js
const { Schema, model } = require('mongoose');

const devilFruitSchema = new Schema({
  name: { type: String, required: true, unique: true },
  rarity: { 
    type: String, 
    enum: ['Common', 'Uncommon', 'Rare', 'Legendary'],
    required: true
  },
  ownerId: { type: String, default: null },
  guildId: { type: String, required: true },
  consumed: { type: Boolean, default: false },
  spawnTime: { type: Date, default: Date.now },
  claimExpiry: { type: Date, default: () => Date.now() + 600000 } // 10min claim window
});

module.exports = model('DevilFruit', devilFruitSchema);
