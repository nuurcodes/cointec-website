/* eslint no-extend-native: 0 */
// core-js comes with Next.js. So, you can import it like below
import includes from 'core-js/library/fn/string/virtual/includes'
import startsWith from 'core-js/library/fn/string/virtual/starts-with'
import repeat from 'core-js/library/fn/string/virtual/repeat'
import assign from 'core-js/library/fn/object/assign'
import find from 'core-js/library/fn/array/virtual/find'
import arrayIncludes from 'core-js/library/fn/array/virtual/includes'

// Add your polyfills
// This files runs at the very beginning (even before React and Next.js core)
console.log('Load your polyfills')

import 'isomorphic-fetch'

String.prototype.includes = includes
String.prototype.startsWith = startsWith
String.prototype.repeat = repeat
Object.assign = assign
Array.prototype.find = find
Array.prototype.includes = arrayIncludes
