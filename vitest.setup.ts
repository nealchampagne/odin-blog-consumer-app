/// <reference types="node" />

import '@testing-library/jest-dom/vitest';
import 'whatwg-fetch'; // polyfills fetch, Request, Response in Node

import process from 'node:process';
import { TextEncoder, TextDecoder } from 'node:util';
import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web';

Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
  TransformStream,
  ReadableStream,
  WritableStream,
});

process.env.VITE_API_URL = 'http://localhost';