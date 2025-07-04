// This file is required by karma.conf.js and loads recursively all the .spec and framework files

/**
 * Test
 */
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

/**
 * Require
 */
declare const require: any;

// First, initialize the Angular testing environment.
/**
 * Test Bed
 */
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Then we find all the tests.
/**
 * Context
 */
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
