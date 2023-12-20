export const STATES = {
  arriving: "arriving",
  stored: "stored",
  delivered: "delivered",
};

export class ArrivingState {
  constructor(item) {
    this.item = item;
    this.state = STATES.arriving;
  }

  store(locationId) {
    this.item.locationId = locationId;
    this.item.changeState(STATES.stored);
  }

  deliver() {
    throw new Error("Item can not be delivered before it is stored.");
  }

  describe() {
    return `Item ${this.item.id} is on its way to the warehouse`;
  }

  isValidTransition(nextState) {
    return nextState === STATES.stored;
  }
}

export class StoredState {
  constructor(item) {
    this.item = item;
    this.state = STATES.stored;
  }

  store() {
    throw new Error("Item was already stored");
  }

  deliver(address) {
    this.item.deliveryAddress = address;
    this.item.locationId = null;
    this.item.changeState("delivered");
  }

  describe() {
    return `Item ${this.item.id} is stored in location ${this.item.locationId}`;
  }

  isValidTransition(nextState) {
    return nextState === STATES.delivered;
  }
}

export class DeliveredState {
  constructor(item) {
    this.item = item;
    this.state = STATES.delivered;
  }

  store() {
    throw new Error("Item was already stored");
  }

  deliver() {
    throw new Error("Item was already delivered");
  }

  describe() {
    return `Item ${this.item.id} was delivered to ${this.item.deliveryAddress}`;
  }

  isValidTransition() {
    return false;
  }
}
