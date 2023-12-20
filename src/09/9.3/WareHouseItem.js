import { ArrivingState, StoredState, DeliveredState, STATES } from "./States";

export class WareHouseItem {
  constructor(id) {
    this.id = id;
    this.currentState = null;
    this.locationId = null;
    this.deliveryAddress = null;
    this.states = {
      [STATES.arriving]: new ArrivingState(this),
      [STATES.stored]: new StoredState(this),
      [STATES.delivered]: new DeliveredState(this),
    };
    this.changeState(STATES.arriving);
  }

  changeState(state) {
    if (!this.states[state]) {
      throw new Error(`State ${state} not supported`);
    }

    if (!this.canChangeState(state)) {
      throw new Error(
        `Can't transition from ${this.currentState.state} to ${state}`,
      );
    }

    this.currentState = this.states[state];
  }

  store(locationId) {
    this.currentState.store(locationId);
  }

  deliver(address) {
    this.currentState.deliver(address);
  }

  describe() {
    return this.currentState.describe();
  }

  canChangeState(state) {
    return !this.currentState || this.currentState.isValidTransition(state);
  }
}
