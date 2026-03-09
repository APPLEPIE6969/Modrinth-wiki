import test, { describe } from "node:test"
import assert from "node:assert/strict"
import { cn } from "./utils.ts"

describe("cn utility", () => {
  test("concatenates basic class strings", () => {
    assert.strictEqual(cn("base-class", "additional-class"), "base-class additional-class")
  })

  test("handles object-based conditional classes", () => {
    assert.strictEqual(cn("base", { "active": true, "hidden": false }), "base active")
  })

  test("handles falsy values (null, undefined, false)", () => {
    assert.strictEqual(cn("base", null, undefined, false, "valid"), "base valid")
  })

  test("handles arrays of classes", () => {
    assert.strictEqual(cn(["a", "b"], "c"), "a b c")
  })

  test("handles nested arrays and objects", () => {
    assert.strictEqual(cn(["a", ["b", { "d": true }]], "c"), "a b d c")
  })

  test("handles tailwind class merging (overriding)", () => {
    // Note: Since twMerge is a third-party dependency, we're testing that cn
    // correctly calls it and returns the merged result.
    assert.strictEqual(cn("p-4 p-8"), "p-8")
    assert.strictEqual(cn("text-red-500 text-blue-500"), "text-blue-500")
  })
})
