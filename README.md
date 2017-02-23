[![](https://img.shields.io/npm/v/subscribr.svg)](https://www.npmjs.com/package/subscribr)
[![](https://api.travis-ci.org/gmaiolo/subscribr.svg)](https://travis-ci.org/GMaiolo/subscribr)

# API

## `Subscribr.on(eventId, handler)`

Subscribe to an event.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| eventId | `string`  | the event ID. |
| handler | `function`  | the callback function. |

#### Returns

- `function`  Subscription destroyer.
<br>

## `Subscribr.emit(eventId, params)`

Emit an event.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| eventId | `string`  | the event ID. |
| params | `object`  | handler params. |
<br>

## `Subscribr.listHandlers(eventId)`

List an event's handlers.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| eventId | `string`  | the event ID. |

#### Returns

- `array`  Event handlers.
<br>

## `Subscribr.remove(eventId)`

Unsubscribe an event.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| eventId | `string`  | the event ID. |
<br>

## `Subscribr.interceptors`

Get interceptors.

#### Returns

- `array`  Interceptors.
<br>

## `Subscribr.events`

Get events.

#### Returns

- `array`  Events.
<br>

## `Subscribr.all`

Get all events and interceptors.

#### Returns

- `object`  Events.
<br>
