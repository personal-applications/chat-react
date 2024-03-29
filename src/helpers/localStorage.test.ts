import {
  saveToLocalStorage,
  getFromLocalStorage,
  deleteFromLocalStorage,
} from "./localStorage";

suite("saveToLocalStorage", () => {
  test("should save a value to local storage", () => {
    const key = "testKey";
    const value = { name: "John", age: 30 };

    saveToLocalStorage(key, value);

    const storedValue = localStorage.getItem(key);
    expect(storedValue).toBe(JSON.stringify(value));
  });
});

suite("getFromLocalStorage", () => {
  test("should return the stored value from local storage", () => {
    const key = "testKey";
    const value = { name: "John", age: 30 };

    localStorage.setItem(key, JSON.stringify(value));

    const retrievedValue = getFromLocalStorage(key);
    expect(retrievedValue).toEqual(value);
  });

  it("should return null if the key does not exist in local storage", () => {
    const key = "nonExistentKey";

    const retrievedValue = getFromLocalStorage(key);
    expect(retrievedValue).toBeNull();
  });
});

suite("deleteFromLocalStorage", () => {
  test("should delete the value from local storage", () => {
    const key = "testKey";
    const value = { name: "John", age: 30 };

    localStorage.setItem(key, JSON.stringify(value));

    deleteFromLocalStorage(key);

    const retrievedValue = localStorage.getItem(key);
    expect(retrievedValue).toBeNull();
  });
});
