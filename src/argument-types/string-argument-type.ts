import { ArgumentType } from './argument-type'

export class StringArgumentType extends ArgumentType {
    public get type(): string {
        return 'String'
    }

    public get rowTestValue(): string {
        return 'string_test_value'
    }

    public get bve5TestValue(): string {
        return `'${this.rowTestValue}'`
    }

    public get csharpTestValue(): string {
        return `"${this.rowTestValue}"`
    }
}

export const stringArgumentType = new StringArgumentType()
