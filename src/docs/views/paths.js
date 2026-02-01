const userPaths = {
  '/api/users': {
    post: {
      tags: ['User'],
      summary: 'create user',
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/UserRequest' } }
        }
      },
      responses: {
        '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } } },
        '400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '409': { description: 'Conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    get: {
      tags: ['User'],
      summary: 'get all users',
      responses: {
        '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/UserResponse' } } } } },
        '400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },
  '/api/users/{id}': {
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User UUID' }
    ],
    get: {
      tags: ['User'],
      summary: 'get user by id',
      responses: {
        '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } } },
        '404': { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    put: {
      tags: ['User'],
      summary: 'update user',
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/UserRequest' } } }
      },
      responses: {
        '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } } },
        '400': { description: 'Bad Request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '404': { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        '409': { description: 'Conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    delete: {
      tags: ['User'],
      summary: 'delete user',
      responses: {
        '204': { description: 'No Content' },
        '404': { description: 'Not Found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  }
};

export { userPaths };