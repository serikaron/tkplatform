'use restrict'

describe.each([
    {key: "ledger", collectionName: "ledgerEntries"},
    {key: "journal", collectionName: "withdrawJournalEntries"}
])("test counting $key entries", ({key, collectionName}) => {
    it("should call db with correct argument", async () => {
        const countEntries = jest.fn(async () => {

        })
    })
})