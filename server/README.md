
## Running Tests
To run the integration tests for the backend (checking business scenarios):
```bash
npm test
```
This requires a MongoDB instance running locally (default: `mongodb://localhost:27017/numbers-tree-test`).
The tests cover:
- Unregistered user capabilities
- Authentication (Register/Login)
- Tree and Node creation
- Edge cases (e.g. divide by zero)
