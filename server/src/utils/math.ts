export const computeValue = (left: number, op: '+' | '-' | '*' | '/', right: number): number => {
    switch (op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/':
            if (right === 0) {
                throw new Error('Division by zero is not allowed');
            }
            return left / right;
        default:
            throw new Error('Invalid operation');
    }
};
