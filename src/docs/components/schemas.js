const schemas = {
  UserRequest: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', example: 'João Silva' },
      email: { type: 'string', format: 'email', example: 'joao@example.com' },
      password: { type: 'string', format: 'password', example: 'senha123' }
    }
  },
  UserUpdateRequest: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'João Silva' },
      email: { type: 'string', format: 'email', example: 'joao@example.com' }
    }
  },
  ChangePasswordRequest: {
    type: 'object',
    required: ['currentPassword', 'newPassword'],
    properties: {
      currentPassword: { type: 'string', format: 'password' },
      newPassword: { type: 'string', format: 'password' }
    }
  },
  UserResponse: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  Error: {
    type: 'object',
    properties: {
      error: { type: 'string' }
    }
  }
};

export default schemas;