export function simpleVerification(response) {
    expect(response.status).toBe(200)
    expect(response.code).toBe(0)
    expect(JSON.stringify(response.data) !== "{}").toBe(true)
}