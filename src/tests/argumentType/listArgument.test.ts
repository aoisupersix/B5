import { listArgument } from '../../argumentTypes/listArgument'

const notSupportedErrorRegex = /is\s*not\s*supported/

describe('List', () => {

    describe('isType()', () => {
        it('same type lower case', () => {
            expect(listArgument.isType('list')).toBeTruthy()
        })
        it('same type upper case', () => {
            expect(listArgument.isType('LIST')).toBeTruthy()
        })
        it('same type pascal case', () => {
            expect(listArgument.isType('List')).toBeTruthy()
        })
        it('same type with space', () => {
            expect(listArgument.isType(' list ')).toBeTruthy()
        })
        it('same type optional', () => {
            expect(listArgument.isType('list?')).toBeTruthy()
        })
        it('different type', () => {
            expect(listArgument.isType('string')).toBeFalsy()
        })
        it('different type but contains type', () => {
            expect(listArgument.isType('listList')).toBeFalsy()
        })
    })

    describe('rowTestValue', () => {
        it('throws not supported error', () => {
            expect(() => listArgument.rowTestValue).toThrow(notSupportedErrorRegex)
        })
    })

    describe('bve5TestValue', () => {
        it('throws not supported error', () => {
            expect(() => listArgument.bve5TestValue).toThrow(notSupportedErrorRegex)
        })
    })

    describe('csharpTestValue', () => {
        it('throws not supported error', () => {
            expect(() => listArgument.csharpTestValue).toThrow(notSupportedErrorRegex)
        })
    })
})
