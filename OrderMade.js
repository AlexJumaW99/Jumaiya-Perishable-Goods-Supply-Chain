/**
 * A transaction processor function that emits an event, when an order is made, for the Farmers to subscribe to 
 * @param {org.perishable.OrderMadeEvent} tx
 * @transaction
 */

async function orderMade(tx) {
    const factory = getFactory();
    const NS = "org.perishable";

    var event = factory.newEvent(NS, "OrderMade");
    emit(event);
}