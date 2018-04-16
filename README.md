# primo-explore-multiple-analytics

## Features
Enables the use of various analytics solutions within Primo.

| Currently Implemented | Source Value | Link To Single Implementation                                                                |
|-----------------------|--------------|----------------------------------------------------------------------------------------------|
| Google Analytics      | `ga`         | [primo-explore-google-analytics](https://github.com/csudhlib/primo-explore-google-analytics) |
| Matomo Analytics      | `matomo`     | [primo-explore-matomo-analytics](https://github.com/csudhlib/primo-explore-matomo-analytics) |


Due to the nature of how Primo updates the page title, a couple alternatives have been implemented for better tracking. The `defaultTitle` config option is used whenever an empty document.title is identified. If the page being loaded is an openurl services page or a fulldisplay record page, the code will attempt to find the title of the record and provide it instead of `document.title`. In all other instances, `document.title` will be provided as the page title.

## Install
1. Copy the contents of `multipleAnalytics.module.js` into your package's `custom.js` file.

## Usage
Once this module is installed, add `multipleAnalytics` as a dependency in your custom module definition.

```js
var app = angular.module('viewCustom', ['multipleAnalytics'])
```

#### Configuration
The module can be configured using the `analyticsOptions` option object.  
Default options are provided in a 'Default' variant of the option object, as shown below. _Only override the non-default object_

##### analyticsOptions / analyticsOptionsDefault

| name           | type         | usage                                                                                 |
|----------------|--------------|---------------------------------------------------------------------------------------|
| `enabled`      | string       | Provided for consortium implementations. Single institutions should leave this `true` |
| `siteSource`   | string       | The `Source Value` for the desired analytics solution                                 |
| `siteId`       | string       | The Site ID provided in your analytics solution admin settings                        |
| `siteUrl`      | string (url) | The URL pointing to where the analytics files live on your library website            |
| `defaultTitle` | string       | The default page title to use when `document.title` returns an empty string           |

### Example
```js
app.value('analyticsOptions', {
    enabled: true,
    siteId: 'UA-012345678-1'
});
```
