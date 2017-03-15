<p align="center">
  <a href="https://www.npmjs.com/package/subscribr"><img src="https://img.shields.io/npm/v/subscribr.svg" alt="npm"></a>
  <a href="https://travis-ci.org/GMaiolo/subscribr"><img src="https://api.travis-ci.org/GMaiolo/subscribr.svg" alt="travis"></a>
  <a href="https://david-dm.org/GMaiolo/subscribr"><img src="https://david-dm.org/GMaiolo/subscribr.svg" alt="dependencies"></a>
  <a href="https://david-dm.org/GMaiolo/subscribr?type=dev"><img src="https://david-dm.org/GMaiolo/subscribr/dev-status.svg" alt="dev dependencies"></a>
</p>

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

## `Subscribr.one(eventId, handler)`

Subcribe an evento to be executed only once (gets self-destroyed after execution).

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
