import { STATES } from "../States";
import { WareHouseItem } from "../WareHouseItem";

describe("WareHouseItem", function () {
    const itemId = 123;
    const locationId = 234;
    const address = "mock address";

    let item;

    test("should correctly initialize item with arriving state and behave accordingly", () => {
        item = new WareHouseItem(itemId);
        expect(item.describe()).toBe(`Item ${itemId} is on its way to the warehouse`);
        expect(() => item.deliver()).toThrow();
        expect(item.canChangeState(STATES.stored)).toBe(true);
        expect(item.canChangeState(STATES.delivered)).toBe(false);
    });

    test("should correctly transition to stored state and behave accordingly", () => {
        item.store(locationId);
        expect(item.describe()).toBe(`Item ${itemId} is stored in location ${locationId}`);
        expect(() => item.store()).toThrow();
        expect(item.canChangeState(STATES.arriving)).toBe(false);
        expect(item.canChangeState(STATES.delivered)).toBe(true);
    });

    test("should correctly transition to delivered state and behave accordingly", () => {
        item.deliver(address);
        expect(item.describe()).toBe(`Item ${itemId} was delivered to ${address}`);
        expect(() => item.store()).toThrow();
        expect(() => item.deliver()).toThrow();
        expect(item.canChangeState(STATES.arriving)).toBe(false);
        expect(item.canChangeState(STATES.stored)).toBe(false);
    });
});
