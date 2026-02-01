import UserResponseDTO from './UserResponseDTO.js';

export default class UserMapper {
  static toResponse(dbRow) {
    if (!dbRow) return null;
    const toIsoUtc = (val) => {
      if (!val) return null;
      // If it's a string without timezone info, assume UTC by appending 'Z'
      if (typeof val === 'string' && !/Z|[+\-]\d{2}:?\d{2}/.test(val)) {
        return new Date(val + 'Z').toISOString();
      }
      return new Date(val).toISOString();
    };

    const createdAt = toIsoUtc(dbRow.created_at);
    const updatedAt = toIsoUtc(dbRow.updated_at);
    return new UserResponseDTO({
      id: dbRow.id,
      name: dbRow.name,
      email: dbRow.email,
      createdAt,
      updatedAt
    });
  }
}