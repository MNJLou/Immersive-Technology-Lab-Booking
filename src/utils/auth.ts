const bcrypt = require('bcryptjs');

/**
 * Hashes the password
 * @param password
 */
const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Compares the password with the hash
 * @param password
 * @param hash
 */
const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export { hashPassword, comparePassword };
