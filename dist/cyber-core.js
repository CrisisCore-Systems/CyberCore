"use strict";
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cyber-core"] = factory();
	else
		root["cyber-core"] = factory();
})(self, () => {
return (self["webpackChunkcyber_core"] = self["webpackChunkcyber_core"] || []).push([["cyber-core"],{

/***/ "./assets/HologramComponent.ts":
/*!*************************************!*\
  !*** ./assets/HologramComponent.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HologramComponent: () => (/* binding */ HologramComponent)
/* harmony export */ });
/**
 * TypeScript wrapper for HologramComponent
 * This provides type safety while maintaining compatibility with the original JS code
 */
// Import the original JavaScript HologramComponent
// We need to use `require` here to bypass TypeScript's module system
// This allows us to import a JavaScript module that doesn't have TypeScript types
const HologramComponentJS = Object(function webpackMissingModule() { var e = new Error("Cannot find module './hologram-component.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) || __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './hologram-component.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
// Export the JavaScript component with TypeScript types
const HologramComponent = HologramComponentJS;


/***/ }),

/***/ "./assets/LoreGenerator.ts":
/*!*********************************!*\
  !*** ./assets/LoreGenerator.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoreGenerator: () => (/* binding */ LoreGenerator)
/* harmony export */ });
/**
 * TypeScript wrapper for LoreGenerator.js
 * Provides type safety while maintaining compatibility with the original lore system
 */
// Import the original JavaScript file
const LoreGeneratorJS = Object(function webpackMissingModule() { var e = new Error("Cannot find module './LoreGenerator.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) || __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './LoreGenerator.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
// Export the JavaScript module with TypeScript types
const LoreGenerator = LoreGeneratorJS;


/***/ }),

/***/ "./assets/TraumaIndex.ts":
/*!*******************************!*\
  !*** ./assets/TraumaIndex.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TraumaIndex: () => (/* binding */ TraumaIndex)
/* harmony export */ });
/**
 * TypeScript wrapper for TraumaIndex.js
 * Provides type safety while maintaining compatibility with the original trauma system
 */
// Import the original JavaScript file
const TraumaIndexJS = Object(function webpackMissingModule() { var e = new Error("Cannot find module './TraumaIndex.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) || __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './TraumaIndex.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
// Export the JavaScript module with TypeScript types
const TraumaIndex = TraumaIndexJS;


/***/ }),

/***/ "./assets/enhanced-cart.ts":
/*!*********************************!*\
  !*** ./assets/enhanced-cart.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EnhancedCart: () => (/* binding */ EnhancedCart)
/* harmony export */ });
/**
 * TypeScript wrapper for enhanced-cart.js
 * Provides type safety while maintaining compatibility with the original cart system
 */
// Import the original JavaScript file
const EnhancedCartJS = Object(function webpackMissingModule() { var e = new Error("Cannot find module './enhanced-cart.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) || __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './enhanced-cart.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
// Export the JavaScript module with TypeScript types
const EnhancedCart = EnhancedCartJS;


/***/ }),

/***/ "./assets/glitch-engine.ts":
/*!*********************************!*\
  !*** ./assets/glitch-engine.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GlitchEngine: () => (/* binding */ GlitchEngine)
/* harmony export */ });
/**
 * TypeScript wrapper for glitch-engine.js
 * Provides type safety while maintaining compatibility with the original glitch system
 */
// Import the original JavaScript file
const GlitchEngineJS = Object(function webpackMissingModule() { var e = new Error("Cannot find module './glitch-engine.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) || __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './glitch-engine.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
// Export the JavaScript module with TypeScript types
const GlitchEngine = GlitchEngineJS;


/***/ }),

/***/ "./assets/index.ts":
/*!*************************!*\
  !*** ./assets/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EnhancedCart: () => (/* reexport safe */ _enhanced_cart__WEBPACK_IMPORTED_MODULE_3__.EnhancedCart),
/* harmony export */   GlitchEngine: () => (/* reexport safe */ _glitch_engine__WEBPACK_IMPORTED_MODULE_5__.GlitchEngine),
/* harmony export */   HologramComponent: () => (/* reexport safe */ _HologramComponent__WEBPACK_IMPORTED_MODULE_0__.HologramComponent),
/* harmony export */   LoreGenerator: () => (/* reexport safe */ _LoreGenerator__WEBPACK_IMPORTED_MODULE_8__.LoreGenerator),
/* harmony export */   MemoryProtocol: () => (/* reexport safe */ _memory_protocol__WEBPACK_IMPORTED_MODULE_6__.MemoryProtocol),
/* harmony export */   NeuralBus: () => (/* reexport safe */ _neural_bus__WEBPACK_IMPORTED_MODULE_1__.NeuralBus),
/* harmony export */   QEARWebGLBridge: () => (/* reexport safe */ _qear_webgl_bridge__WEBPACK_IMPORTED_MODULE_4__.QEARWebGLBridge),
/* harmony export */   QuantumWebGLController: () => (/* reexport safe */ _quantum_webgl__WEBPACK_IMPORTED_MODULE_2__.QuantumWebGLController),
/* harmony export */   TraumaIndex: () => (/* reexport safe */ _TraumaIndex__WEBPACK_IMPORTED_MODULE_7__.TraumaIndex)
/* harmony export */ });
/* harmony import */ var _HologramComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HologramComponent */ "./assets/HologramComponent.ts");
/* harmony import */ var _neural_bus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./neural-bus */ "./assets/neural-bus.ts");
/* harmony import */ var _quantum_webgl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./quantum-webgl */ "./assets/quantum-webgl.ts");
/* harmony import */ var _enhanced_cart__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./enhanced-cart */ "./assets/enhanced-cart.ts");
/* harmony import */ var _qear_webgl_bridge__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./qear-webgl-bridge */ "./assets/qear-webgl-bridge.ts");
/* harmony import */ var _glitch_engine__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./glitch-engine */ "./assets/glitch-engine.ts");
/* harmony import */ var _memory_protocol__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./memory-protocol */ "./assets/memory-protocol.ts");
/* harmony import */ var _TraumaIndex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TraumaIndex */ "./assets/TraumaIndex.ts");
/* harmony import */ var _LoreGenerator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./LoreGenerator */ "./assets/LoreGenerator.ts");
/**
 * CyberCore Entry Point
 *
 * This file imports and exports all components for use in the bundle
 * Version: 2.0.0
 * Date: April 19, 2025
 */
// Import Web Components

// Import core services



// Import WebGL bridge

// Import utilities




// Register Web Components if not already registered
if (!customElements.get('quantum-hologram')) {
    customElements.define('quantum-hologram', HologramComponent);
}
// Initialize services with webpack environment variables
const DEBUG_MODE = "development" !== 'production';
// Auto-initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.info('CyberCore initialized in ' + (DEBUG_MODE ? 'development' : 'production') + ' mode');
    // Initialize the NeuralBus event system
    NeuralBus.initialize();
    // Register all components with the NeuralBus
    NeuralBus.register('hologram-component', { version: '2.0.0' });
    NeuralBus.register('enhanced-cart', { version: '2.0.0' });
    NeuralBus.register('quantum-webgl', { version: '2.0.0' });
    // Publish initialization event
    NeuralBus.publish('cybercore:initialized', {
        timestamp: Date.now(),
        environment: DEBUG_MODE ? 'development' : 'production',
        components: [
            'hologram-component',
            'enhanced-cart',
            'quantum-webgl'
        ]
    });
});


/***/ }),

/***/ "./assets/memory-protocol.ts":
/*!***********************************!*\
  !*** ./assets/memory-protocol.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MemoryProtocol: () => (/* binding */ MemoryProtocol)
/* harmony export */ });
/**
 * TypeScript wrapper for memory-protocol.js
 * Provides type safety while maintaining compatibility with the original memory system
 */
// Import the original JavaScript file
const MemoryProtocolJS = Object(function webpackMissingModule() { var e = new Error("Cannot find module './memory-protocol.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) || __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './memory-protocol.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
// Export the JavaScript module with TypeScript types
const MemoryProtocol = MemoryProtocolJS;


/***/ }),

/***/ "./assets/neural-bus.ts":
/*!******************************!*\
  !*** ./assets/neural-bus.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NeuralBus: () => (/* binding */ NeuralBus)
/* harmony export */ });
/**
 * TypeScript wrapper for neural-bus.js
 * Provides type safety while maintaining compatibility with the original event system
 */
// Import the original JavaScript file
const NeuralBusJS = Object(function webpackMissingModule() { var e = new Error("Cannot find module './neural-bus.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) || __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './neural-bus.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
// Export the JavaScript module with TypeScript types
const NeuralBus = NeuralBusJS;


/***/ }),

/***/ "./assets/qear-webgl-bridge.ts":
/*!*************************************!*\
  !*** ./assets/qear-webgl-bridge.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QEARWebGLBridge: () => (/* binding */ QEARWebGLBridge)
/* harmony export */ });
/**
 * TypeScript wrapper for qear-webgl-bridge.js
 * Provides type safety while maintaining compatibility with the original WebGL bridge
 */
// Import the original JavaScript file
const QEARWebGLBridgeJS = Object(function webpackMissingModule() { var e = new Error("Cannot find module './qear-webgl-bridge.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) || __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './qear-webgl-bridge.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
// Export the JavaScript module with TypeScript types
const QEARWebGLBridge = QEARWebGLBridgeJS;


/***/ }),

/***/ "./assets/quantum-webgl.ts":
/*!*********************************!*\
  !*** ./assets/quantum-webgl.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QuantumWebGLController: () => (/* binding */ QuantumWebGLController)
/* harmony export */ });
/**
 * TypeScript wrapper for quantum-webgl.js
 * Provides type safety while maintaining compatibility with the original code
 */
// Import the original JavaScript file
const QuantumWebGLControllerJS = Object(function webpackMissingModule() { var e = new Error("Cannot find module './quantum-webgl.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) || __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './quantum-webgl.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
// Export the JavaScript component with TypeScript types
const QuantumWebGLController = QuantumWebGLControllerJS;


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./assets/index.ts"));
/******/ __webpack_exports__ = __webpack_exports__["default"];
/******/ return __webpack_exports__;
/******/ }
]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3liZXItY29yZS5qcyIsIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7Ozs7Ozs7OztBQ1ZBOzs7R0FHRztBQUVILG1EQUFtRDtBQUNuRCxxRUFBcUU7QUFDckUsa0ZBQWtGO0FBQ2xGLE1BQU0sbUJBQW1CLEdBQUcsc0pBQTBDLElBQUksbUJBQU8sQ0FBQyxzSkFBeUIsQ0FBQyxDQUFDO0FBd0I3Ryx3REFBd0Q7QUFDakQsTUFBTSxpQkFBaUIsR0FBRyxtQkFBa0YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDakNwSDs7O0dBR0c7QUFFSCxzQ0FBc0M7QUFDdEMsTUFBTSxlQUFlLEdBQUcsaUpBQXFDLElBQUksbUJBQU8sQ0FBQyxpSkFBb0IsQ0FBQyxDQUFDO0FBeUMvRixxREFBcUQ7QUFDOUMsTUFBTSxhQUFhLEdBQTJCLGVBQWUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDaERyRTs7O0dBR0c7QUFFSCxzQ0FBc0M7QUFDdEMsTUFBTSxhQUFhLEdBQUcsK0lBQW1DLElBQUksbUJBQU8sQ0FBQywrSUFBa0IsQ0FBQyxDQUFDO0FBdUN6RixxREFBcUQ7QUFDOUMsTUFBTSxXQUFXLEdBQXlCLGFBQWEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDOUMvRDs7O0dBR0c7QUFFSCxzQ0FBc0M7QUFDdEMsTUFBTSxjQUFjLEdBQUcsaUpBQXFDLElBQUksbUJBQU8sQ0FBQyxpSkFBb0IsQ0FBQyxDQUFDO0FBa0Q5RixxREFBcUQ7QUFDOUMsTUFBTSxZQUFZLEdBQTBCLGNBQWMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDekRsRTs7O0dBR0c7QUFFSCxzQ0FBc0M7QUFDdEMsTUFBTSxjQUFjLEdBQUcsaUpBQXFDLElBQUksbUJBQU8sQ0FBQyxpSkFBb0IsQ0FBQyxDQUFDO0FBK0I5RixxREFBcUQ7QUFDOUMsTUFBTSxZQUFZLEdBQTBCLGNBQWMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Q2xFOzs7Ozs7R0FNRztBQUVILHdCQUF3QjtBQUNnQztBQUV4RCx1QkFBdUI7QUFDa0I7QUFDZ0I7QUFDVjtBQUUvQyxzQkFBc0I7QUFDZ0M7QUFFdEQsbUJBQW1CO0FBQzRCO0FBQ0k7QUFDUDtBQUNJO0FBRWhELG9EQUFvRDtBQUNwRCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUM7SUFDMUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxpQkFBd0IsQ0FBQyxDQUFDO0FBQ3hFLENBQUM7QUFFRCx5REFBeUQ7QUFDekQsTUFBTSxVQUFVLEdBQUcsYUFBb0IsS0FBSyxZQUFZLENBQUM7QUFFekQsd0NBQXdDO0FBQ3hDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDL0MsT0FBTyxDQUFDLElBQUksQ0FBQywyQkFBMkIsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUVsRyx3Q0FBd0M7SUFDeEMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBRXZCLDZDQUE2QztJQUM3QyxTQUFTLENBQUMsUUFBUSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDL0QsU0FBUyxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUMxRCxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBRTFELCtCQUErQjtJQUMvQixTQUFTLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFO1FBQ3ZDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ3JCLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsWUFBWTtRQUN0RCxVQUFVLEVBQUU7WUFDUixvQkFBb0I7WUFDcEIsZUFBZTtZQUNmLGVBQWU7U0FDbEI7S0FDSixDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDdkRIOzs7R0FHRztBQUVILHNDQUFzQztBQUN0QyxNQUFNLGdCQUFnQixHQUFHLG1KQUF1QyxJQUFJLG1CQUFPLENBQUMsbUpBQXNCLENBQUMsQ0FBQztBQTBDcEcscURBQXFEO0FBQzlDLE1BQU0sY0FBYyxHQUE0QixnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDakR4RTs7O0dBR0c7QUFFSCxzQ0FBc0M7QUFDdEMsTUFBTSxXQUFXLEdBQUcsOElBQWtDLElBQUksbUJBQU8sQ0FBQyw4SUFBaUIsQ0FBQyxDQUFDO0FBOEJyRixxREFBcUQ7QUFDOUMsTUFBTSxTQUFTLEdBQXVCLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDckN6RDs7O0dBR0c7QUFFSCxzQ0FBc0M7QUFDdEMsTUFBTSxpQkFBaUIsR0FBRyxxSkFBeUMsSUFBSSxtQkFBTyxDQUFDLHFKQUF3QixDQUFDLENBQUM7QUFvQnpHLHFEQUFxRDtBQUM5QyxNQUFNLGVBQWUsR0FBNkIsaUJBQWlCLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQzNCM0U7OztHQUdHO0FBRUgsc0NBQXNDO0FBQ3RDLE1BQU0sd0JBQXdCLEdBQUcsaUpBQXFDLElBQUksbUJBQU8sQ0FBQyxpSkFBb0IsQ0FBQyxDQUFDO0FBd0J4Ryx3REFBd0Q7QUFDakQsTUFBTSxzQkFBc0IsR0FBRyx3QkFHckMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2N5YmVyLWNvcmUvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2N5YmVyLWNvcmUvLi9hc3NldHMvSG9sb2dyYW1Db21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vY3liZXItY29yZS8uL2Fzc2V0cy9Mb3JlR2VuZXJhdG9yLnRzIiwid2VicGFjazovL2N5YmVyLWNvcmUvLi9hc3NldHMvVHJhdW1hSW5kZXgudHMiLCJ3ZWJwYWNrOi8vY3liZXItY29yZS8uL2Fzc2V0cy9lbmhhbmNlZC1jYXJ0LnRzIiwid2VicGFjazovL2N5YmVyLWNvcmUvLi9hc3NldHMvZ2xpdGNoLWVuZ2luZS50cyIsIndlYnBhY2s6Ly9jeWJlci1jb3JlLy4vYXNzZXRzL2luZGV4LnRzIiwid2VicGFjazovL2N5YmVyLWNvcmUvLi9hc3NldHMvbWVtb3J5LXByb3RvY29sLnRzIiwid2VicGFjazovL2N5YmVyLWNvcmUvLi9hc3NldHMvbmV1cmFsLWJ1cy50cyIsIndlYnBhY2s6Ly9jeWJlci1jb3JlLy4vYXNzZXRzL3FlYXItd2ViZ2wtYnJpZGdlLnRzIiwid2VicGFjazovL2N5YmVyLWNvcmUvLi9hc3NldHMvcXVhbnR1bS13ZWJnbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJjeWJlci1jb3JlXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImN5YmVyLWNvcmVcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiLyoqXHJcbiAqIFR5cGVTY3JpcHQgd3JhcHBlciBmb3IgSG9sb2dyYW1Db21wb25lbnRcclxuICogVGhpcyBwcm92aWRlcyB0eXBlIHNhZmV0eSB3aGlsZSBtYWludGFpbmluZyBjb21wYXRpYmlsaXR5IHdpdGggdGhlIG9yaWdpbmFsIEpTIGNvZGVcclxuICovXHJcblxyXG4vLyBJbXBvcnQgdGhlIG9yaWdpbmFsIEphdmFTY3JpcHQgSG9sb2dyYW1Db21wb25lbnRcclxuLy8gV2UgbmVlZCB0byB1c2UgYHJlcXVpcmVgIGhlcmUgdG8gYnlwYXNzIFR5cGVTY3JpcHQncyBtb2R1bGUgc3lzdGVtXHJcbi8vIFRoaXMgYWxsb3dzIHVzIHRvIGltcG9ydCBhIEphdmFTY3JpcHQgbW9kdWxlIHRoYXQgZG9lc24ndCBoYXZlIFR5cGVTY3JpcHQgdHlwZXNcclxuY29uc3QgSG9sb2dyYW1Db21wb25lbnRKUyA9IHJlcXVpcmUoJy4vaG9sb2dyYW0tY29tcG9uZW50LmpzJykuZGVmYXVsdCB8fCByZXF1aXJlKCcuL2hvbG9ncmFtLWNvbXBvbmVudC5qcycpO1xyXG5cclxuLy8gRGVmaW5lIHRoZSBUeXBlU2NyaXB0IGludGVyZmFjZSBmb3IgdGhlIEhvbG9ncmFtQ29tcG9uZW50XHJcbmV4cG9ydCBpbnRlcmZhY2UgSG9sb2dyYW1Db21wb25lbnRJbnRlcmZhY2Uge1xyXG4gIC8vIFByb3BlcnRpZXNcclxuICBob2xvZ3JhbVR5cGU6IHN0cmluZztcclxuICBpbnRlbnNpdHk6IG51bWJlcjtcclxuICB0cmF1bWFMZXZlbDogbnVtYmVyO1xyXG4gIGlzQWN0aXZlOiBib29sZWFuO1xyXG4gIHJlbmRlck1vZGU6ICdzdGFuZGFyZCcgfCAncXVhbnR1bScgfCAnaHlicmlkJztcclxuICBcclxuICAvLyBNZXRob2RzXHJcbiAgaW5pdGlhbGl6ZShjb25maWc/OiBhbnkpOiBQcm9taXNlPHZvaWQ+O1xyXG4gIHJlbmRlcigpOiB2b2lkO1xyXG4gIHVwZGF0ZShwcm9wczogYW55KTogdm9pZDtcclxuICBhcHBseUdsaXRjaChpbnRlbnNpdHk/OiBudW1iZXIsIGR1cmF0aW9uPzogbnVtYmVyKTogdm9pZDtcclxuICBkaXNwb3NlKCk6IHZvaWQ7XHJcbiAgXHJcbiAgLy8gV2ViIENvbXBvbmVudCBMaWZlY3ljbGUgTWV0aG9kc1xyXG4gIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQ7XHJcbiAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZDtcclxuICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2sobmFtZTogc3RyaW5nLCBvbGRWYWx1ZTogc3RyaW5nLCBuZXdWYWx1ZTogc3RyaW5nKTogdm9pZDtcclxufVxyXG5cclxuLy8gRXhwb3J0IHRoZSBKYXZhU2NyaXB0IGNvbXBvbmVudCB3aXRoIFR5cGVTY3JpcHQgdHlwZXNcclxuZXhwb3J0IGNvbnN0IEhvbG9ncmFtQ29tcG9uZW50ID0gSG9sb2dyYW1Db21wb25lbnRKUyBhcyAobmV3ICgpID0+IEhvbG9ncmFtQ29tcG9uZW50SW50ZXJmYWNlKSAmIHR5cGVvZiBIVE1MRWxlbWVudDsiLCIvKipcclxuICogVHlwZVNjcmlwdCB3cmFwcGVyIGZvciBMb3JlR2VuZXJhdG9yLmpzXHJcbiAqIFByb3ZpZGVzIHR5cGUgc2FmZXR5IHdoaWxlIG1haW50YWluaW5nIGNvbXBhdGliaWxpdHkgd2l0aCB0aGUgb3JpZ2luYWwgbG9yZSBzeXN0ZW1cclxuICovXHJcblxyXG4vLyBJbXBvcnQgdGhlIG9yaWdpbmFsIEphdmFTY3JpcHQgZmlsZVxyXG5jb25zdCBMb3JlR2VuZXJhdG9ySlMgPSByZXF1aXJlKCcuL0xvcmVHZW5lcmF0b3IuanMnKS5kZWZhdWx0IHx8IHJlcXVpcmUoJy4vTG9yZUdlbmVyYXRvci5qcycpO1xyXG5cclxuLy8gRGVmaW5lIFR5cGVTY3JpcHQgaW50ZXJmYWNlcyBmb3IgdGhlIExvcmVHZW5lcmF0b3JcclxuZXhwb3J0IGludGVyZmFjZSBMb3JlRnJhZ21lbnQge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgdHlwZTogJ2JhY2tzdG9yeScgfCAnZW5jb3VudGVyJyB8ICdhcnRpZmFjdCcgfCAnY2hhcmFjdGVyJyB8ICdsb2NhdGlvbicgfCAnZXZlbnQnO1xyXG4gIGNvbnRlbnQ6IHN0cmluZztcclxuICB0aW1lc3RhbXA6IG51bWJlcjtcclxuICB0YWdzOiBzdHJpbmdbXTtcclxuICB0cmF1bWFJbmRleDogbnVtYmVyO1xyXG4gIGdsaXRjaEZhY3RvcjogbnVtYmVyO1xyXG4gIG1ldGFkYXRhPzogUmVjb3JkPHN0cmluZywgYW55PjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBMb3JlR2VuZXJhdG9yT3B0aW9ucyB7XHJcbiAgYmFzZVRyYXVtYUxldmVsPzogbnVtYmVyO1xyXG4gIGdsaXRjaEludGVuc2l0eT86IG51bWJlcjtcclxuICBzZWVkUGhyYXNlPzogc3RyaW5nO1xyXG4gIHVzZVJhbmRvbWl6YXRpb24/OiBib29sZWFuO1xyXG4gIGZyYWdtZW50VHlwZXM/OiBzdHJpbmdbXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBMb3JlR2VuZXJhdG9ySW50ZXJmYWNlIHtcclxuICAvLyBQcm9wZXJ0aWVzXHJcbiAgaXNJbml0aWFsaXplZDogYm9vbGVhbjtcclxuICBmcmFnbWVudENvdW50OiBudW1iZXI7XHJcbiAgb3B0aW9uczogTG9yZUdlbmVyYXRvck9wdGlvbnM7XHJcbiAgXHJcbiAgLy8gTWV0aG9kc1xyXG4gIGluaXRpYWxpemUob3B0aW9ucz86IExvcmVHZW5lcmF0b3JPcHRpb25zKTogUHJvbWlzZTx2b2lkPjtcclxuICBnZW5lcmF0ZUZyYWdtZW50KHR5cGU/OiBMb3JlRnJhZ21lbnRbJ3R5cGUnXSwgb3B0aW9ucz86IFBhcnRpYWw8TG9yZUdlbmVyYXRvck9wdGlvbnM+KTogTG9yZUZyYWdtZW50O1xyXG4gIGdldEZyYWdtZW50QnlJZChpZDogc3RyaW5nKTogTG9yZUZyYWdtZW50IHwgbnVsbDtcclxuICBnZXRBbGxGcmFnbWVudHMoKTogTG9yZUZyYWdtZW50W107XHJcbiAgZ2V0RnJhZ21lbnRzQnlUeXBlKHR5cGU6IExvcmVGcmFnbWVudFsndHlwZSddKTogTG9yZUZyYWdtZW50W107XHJcbiAgZ2V0RnJhZ21lbnRzQnlUYWcodGFnOiBzdHJpbmcpOiBMb3JlRnJhZ21lbnRbXTtcclxuICByZW1vdmVGcmFnbWVudChpZDogc3RyaW5nKTogYm9vbGVhbjtcclxuICBzZXRUcmF1bWFMZXZlbChsZXZlbDogbnVtYmVyKTogdm9pZDtcclxuICBzZXRHbGl0Y2hJbnRlbnNpdHkobGV2ZWw6IG51bWJlcik6IHZvaWQ7XHJcbiAgZGlzcG9zZSgpOiB2b2lkO1xyXG59XHJcblxyXG4vLyBFeHBvcnQgdGhlIEphdmFTY3JpcHQgbW9kdWxlIHdpdGggVHlwZVNjcmlwdCB0eXBlc1xyXG5leHBvcnQgY29uc3QgTG9yZUdlbmVyYXRvcjogTG9yZUdlbmVyYXRvckludGVyZmFjZSA9IExvcmVHZW5lcmF0b3JKUzsiLCIvKipcclxuICogVHlwZVNjcmlwdCB3cmFwcGVyIGZvciBUcmF1bWFJbmRleC5qc1xyXG4gKiBQcm92aWRlcyB0eXBlIHNhZmV0eSB3aGlsZSBtYWludGFpbmluZyBjb21wYXRpYmlsaXR5IHdpdGggdGhlIG9yaWdpbmFsIHRyYXVtYSBzeXN0ZW1cclxuICovXHJcblxyXG4vLyBJbXBvcnQgdGhlIG9yaWdpbmFsIEphdmFTY3JpcHQgZmlsZVxyXG5jb25zdCBUcmF1bWFJbmRleEpTID0gcmVxdWlyZSgnLi9UcmF1bWFJbmRleC5qcycpLmRlZmF1bHQgfHwgcmVxdWlyZSgnLi9UcmF1bWFJbmRleC5qcycpO1xyXG5cclxuLy8gRGVmaW5lIFR5cGVTY3JpcHQgaW50ZXJmYWNlcyBmb3IgdGhlIFRyYXVtYUluZGV4XHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhdW1hUHJvZmlsZSB7XHJcbiAgaWQ6IHN0cmluZztcclxuICBiYXNlTGV2ZWw6IG51bWJlcjtcclxuICBtb2RpZmllcnM6IFRyYXVtYU1vZGlmaWVyW107XHJcbiAgdGltZXN0YW1wOiBudW1iZXI7XHJcbiAgc291cmNlOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhdW1hTW9kaWZpZXIge1xyXG4gIHR5cGU6IHN0cmluZztcclxuICB2YWx1ZTogbnVtYmVyO1xyXG4gIGR1cmF0aW9uPzogbnVtYmVyOyAgLy8gaW4gbWlsbGlzZWNvbmRzXHJcbiAgZXhwaXJlc0F0PzogbnVtYmVyOyAvLyB0aW1lc3RhbXBcclxuICBzb3VyY2U/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhdW1hSW5kZXhJbnRlcmZhY2Uge1xyXG4gIC8vIFByb3BlcnRpZXNcclxuICBjdXJyZW50TGV2ZWw6IG51bWJlcjtcclxuICBiYXNlTGV2ZWw6IG51bWJlcjtcclxuICBwcm9maWxlczogVHJhdW1hUHJvZmlsZVtdO1xyXG4gIGlzQWN0aXZlOiBib29sZWFuO1xyXG4gIGxhc3RVcGRhdGVkOiBudW1iZXI7XHJcbiAgXHJcbiAgLy8gTWV0aG9kc1xyXG4gIGluaXRpYWxpemUob3B0aW9ucz86IGFueSk6IFByb21pc2U8dm9pZD47XHJcbiAgZ2V0Q3VycmVudExldmVsKCk6IG51bWJlcjtcclxuICBhZGRUcmF1bWFQcm9maWxlKHByb2ZpbGU6IFBhcnRpYWw8VHJhdW1hUHJvZmlsZT4pOiBUcmF1bWFQcm9maWxlO1xyXG4gIGFkZE1vZGlmaWVyKG1vZGlmaWVyOiBUcmF1bWFNb2RpZmllcik6IHZvaWQ7XHJcbiAgcmVtb3ZlTW9kaWZpZXIobW9kaWZpZXJJZDogc3RyaW5nKTogYm9vbGVhbjtcclxuICBjbGVhckFsbE1vZGlmaWVycygpOiB2b2lkO1xyXG4gIHVwZGF0ZSh0aW1lc3RhbXA/OiBudW1iZXIpOiBudW1iZXI7XHJcbiAgZ2VuZXJhdGVUcmF1bWFSZXBvcnQoKTogUmVjb3JkPHN0cmluZywgYW55PjtcclxuICBkaXNwb3NlKCk6IHZvaWQ7XHJcbn1cclxuXHJcbi8vIEV4cG9ydCB0aGUgSmF2YVNjcmlwdCBtb2R1bGUgd2l0aCBUeXBlU2NyaXB0IHR5cGVzXHJcbmV4cG9ydCBjb25zdCBUcmF1bWFJbmRleDogVHJhdW1hSW5kZXhJbnRlcmZhY2UgPSBUcmF1bWFJbmRleEpTOyIsIi8qKlxyXG4gKiBUeXBlU2NyaXB0IHdyYXBwZXIgZm9yIGVuaGFuY2VkLWNhcnQuanNcclxuICogUHJvdmlkZXMgdHlwZSBzYWZldHkgd2hpbGUgbWFpbnRhaW5pbmcgY29tcGF0aWJpbGl0eSB3aXRoIHRoZSBvcmlnaW5hbCBjYXJ0IHN5c3RlbVxyXG4gKi9cclxuXHJcbi8vIEltcG9ydCB0aGUgb3JpZ2luYWwgSmF2YVNjcmlwdCBmaWxlXHJcbmNvbnN0IEVuaGFuY2VkQ2FydEpTID0gcmVxdWlyZSgnLi9lbmhhbmNlZC1jYXJ0LmpzJykuZGVmYXVsdCB8fCByZXF1aXJlKCcuL2VuaGFuY2VkLWNhcnQuanMnKTtcclxuXHJcbi8vIERlZmluZSBUeXBlU2NyaXB0IGludGVyZmFjZXMgZm9yIHRoZSBFbmhhbmNlZENhcnRcclxuZXhwb3J0IGludGVyZmFjZSBDYXJ0SXRlbSB7XHJcbiAgaWQ6IHN0cmluZztcclxuICB2YXJpYW50SWQ/OiBzdHJpbmc7XHJcbiAgcXVhbnRpdHk6IG51bWJlcjtcclxuICBwcmljZTogbnVtYmVyO1xyXG4gIHRpdGxlOiBzdHJpbmc7XHJcbiAgb3B0aW9ucz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XHJcbiAgcHJvcGVydGllcz86IFJlY29yZDxzdHJpbmcsIGFueT47XHJcbiAgcXVhbnR1bVByb3BlcnRpZXM/OiB7XHJcbiAgICBnbGl0Y2hGYWN0b3I/OiBudW1iZXI7XHJcbiAgICB0cmF1bWFJbmRleD86IG51bWJlcjtcclxuICAgIG11dGF0aW9uUHJvZmlsZT86IHN0cmluZztcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENhcnRTdGF0ZSB7XHJcbiAgaXRlbXM6IENhcnRJdGVtW107XHJcbiAgdG90YWxQcmljZTogbnVtYmVyO1xyXG4gIHRvdGFsUXVhbnRpdHk6IG51bWJlcjtcclxuICBjdXJyZW5jeTogc3RyaW5nO1xyXG4gIGxhc3RNb2RpZmllZDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEVuaGFuY2VkQ2FydEludGVyZmFjZSB7XHJcbiAgLy8gUHJvcGVydGllc1xyXG4gIHN0YXRlOiBDYXJ0U3RhdGU7XHJcbiAgaXNSZWFkeTogYm9vbGVhbjtcclxuICBcclxuICAvLyBDb3JlIE1ldGhvZHNcclxuICBpbml0aWFsaXplKG9wdGlvbnM/OiBhbnkpOiBQcm9taXNlPHZvaWQ+O1xyXG4gIHJlZnJlc2goKTogUHJvbWlzZTxDYXJ0U3RhdGU+O1xyXG4gIFxyXG4gIC8vIENhcnQgTWFuaXB1bGF0aW9uIE1ldGhvZHNcclxuICBhZGRJdGVtKGl0ZW06IFBhcnRpYWw8Q2FydEl0ZW0+KTogUHJvbWlzZTxDYXJ0U3RhdGU+O1xyXG4gIHVwZGF0ZUl0ZW0oaWQ6IHN0cmluZywgdXBkYXRlczogUGFydGlhbDxDYXJ0SXRlbT4pOiBQcm9taXNlPENhcnRTdGF0ZT47XHJcbiAgcmVtb3ZlSXRlbShpZDogc3RyaW5nKTogUHJvbWlzZTxDYXJ0U3RhdGU+O1xyXG4gIGNsZWFyQ2FydCgpOiBQcm9taXNlPENhcnRTdGF0ZT47XHJcbiAgXHJcbiAgLy8gQWRkaXRpb25hbCBFbmhhbmNlZCBNZXRob2RzXHJcbiAgYXBwbHlRdWFudHVtUHJvcGVydGllcyhpdGVtSWQ6IHN0cmluZywgcHJvcGVydGllczogQ2FydEl0ZW1bJ3F1YW50dW1Qcm9wZXJ0aWVzJ10pOiBQcm9taXNlPENhcnRTdGF0ZT47XHJcbiAgZ2VuZXJhdGVNdXRhdGlvblByb2ZpbGUoKTogUHJvbWlzZTxzdHJpbmc+O1xyXG4gIFxyXG4gIC8vIEV2ZW50IE1ldGhvZHNcclxuICBvblVwZGF0ZShjYWxsYmFjazogKHN0YXRlOiBDYXJ0U3RhdGUpID0+IHZvaWQpOiBzdHJpbmc7XHJcbiAgb2ZmVXBkYXRlKGNhbGxiYWNrSWQ6IHN0cmluZyk6IGJvb2xlYW47XHJcbn1cclxuXHJcbi8vIEV4cG9ydCB0aGUgSmF2YVNjcmlwdCBtb2R1bGUgd2l0aCBUeXBlU2NyaXB0IHR5cGVzXHJcbmV4cG9ydCBjb25zdCBFbmhhbmNlZENhcnQ6IEVuaGFuY2VkQ2FydEludGVyZmFjZSA9IEVuaGFuY2VkQ2FydEpTOyIsIi8qKlxyXG4gKiBUeXBlU2NyaXB0IHdyYXBwZXIgZm9yIGdsaXRjaC1lbmdpbmUuanNcclxuICogUHJvdmlkZXMgdHlwZSBzYWZldHkgd2hpbGUgbWFpbnRhaW5pbmcgY29tcGF0aWJpbGl0eSB3aXRoIHRoZSBvcmlnaW5hbCBnbGl0Y2ggc3lzdGVtXHJcbiAqL1xyXG5cclxuLy8gSW1wb3J0IHRoZSBvcmlnaW5hbCBKYXZhU2NyaXB0IGZpbGVcclxuY29uc3QgR2xpdGNoRW5naW5lSlMgPSByZXF1aXJlKCcuL2dsaXRjaC1lbmdpbmUuanMnKS5kZWZhdWx0IHx8IHJlcXVpcmUoJy4vZ2xpdGNoLWVuZ2luZS5qcycpO1xyXG5cclxuLy8gRGVmaW5lIFR5cGVTY3JpcHQgaW50ZXJmYWNlcyBmb3IgdGhlIEdsaXRjaEVuZ2luZVxyXG5leHBvcnQgaW50ZXJmYWNlIEdsaXRjaEVmZmVjdCB7XHJcbiAgaWQ6IHN0cmluZztcclxuICB0eXBlOiBzdHJpbmc7XHJcbiAgaW50ZW5zaXR5OiBudW1iZXI7XHJcbiAgZHVyYXRpb24/OiBudW1iZXI7ICAvLyBpbiBtaWxsaXNlY29uZHNcclxuICBleHBpcmVzQXQ/OiBudW1iZXI7IC8vIHRpbWVzdGFtcFxyXG4gIHRhcmdldD86IHN0cmluZzsgICAgLy8gQ1NTIHNlbGVjdG9yIG9yIGVsZW1lbnQgaWRcclxuICBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgYW55PjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBHbGl0Y2hFbmdpbmVJbnRlcmZhY2Uge1xyXG4gIC8vIFByb3BlcnRpZXNcclxuICBpc0FjdGl2ZTogYm9vbGVhbjtcclxuICBjdXJyZW50RWZmZWN0czogR2xpdGNoRWZmZWN0W107XHJcbiAgYmFzZUludGVuc2l0eTogbnVtYmVyO1xyXG4gIGxhc3RVcGRhdGVkOiBudW1iZXI7XHJcbiAgXHJcbiAgLy8gTWV0aG9kc1xyXG4gIGluaXRpYWxpemUob3B0aW9ucz86IGFueSk6IFByb21pc2U8dm9pZD47XHJcbiAgYXBwbHlFZmZlY3QoZWZmZWN0OiBQYXJ0aWFsPEdsaXRjaEVmZmVjdD4pOiBHbGl0Y2hFZmZlY3Q7XHJcbiAgcmVtb3ZlRWZmZWN0KGVmZmVjdElkOiBzdHJpbmcpOiBib29sZWFuO1xyXG4gIGNsZWFyQWxsRWZmZWN0cygpOiB2b2lkO1xyXG4gIHNldEJhc2VJbnRlbnNpdHkodmFsdWU6IG51bWJlcik6IHZvaWQ7XHJcbiAgZ2V0Q3VycmVudEludGVuc2l0eSgpOiBudW1iZXI7XHJcbiAgdXBkYXRlKHRpbWVzdGFtcD86IG51bWJlcik6IHZvaWQ7XHJcbiAgZGlzcG9zZSgpOiB2b2lkO1xyXG59XHJcblxyXG4vLyBFeHBvcnQgdGhlIEphdmFTY3JpcHQgbW9kdWxlIHdpdGggVHlwZVNjcmlwdCB0eXBlc1xyXG5leHBvcnQgY29uc3QgR2xpdGNoRW5naW5lOiBHbGl0Y2hFbmdpbmVJbnRlcmZhY2UgPSBHbGl0Y2hFbmdpbmVKUzsiLCIvKipcclxuICogQ3liZXJDb3JlIEVudHJ5IFBvaW50XHJcbiAqXHJcbiAqIFRoaXMgZmlsZSBpbXBvcnRzIGFuZCBleHBvcnRzIGFsbCBjb21wb25lbnRzIGZvciB1c2UgaW4gdGhlIGJ1bmRsZVxyXG4gKiBWZXJzaW9uOiAyLjAuMFxyXG4gKiBEYXRlOiBBcHJpbCAxOSwgMjAyNVxyXG4gKi9cclxuXHJcbi8vIEltcG9ydCBXZWIgQ29tcG9uZW50c1xyXG5leHBvcnQgeyBIb2xvZ3JhbUNvbXBvbmVudCB9IGZyb20gJy4vSG9sb2dyYW1Db21wb25lbnQnO1xyXG5cclxuLy8gSW1wb3J0IGNvcmUgc2VydmljZXNcclxuZXhwb3J0IHsgTmV1cmFsQnVzIH0gZnJvbSAnLi9uZXVyYWwtYnVzJztcclxuZXhwb3J0IHsgUXVhbnR1bVdlYkdMQ29udHJvbGxlciB9IGZyb20gJy4vcXVhbnR1bS13ZWJnbCc7XHJcbmV4cG9ydCB7IEVuaGFuY2VkQ2FydCB9IGZyb20gJy4vZW5oYW5jZWQtY2FydCc7XHJcblxyXG4vLyBJbXBvcnQgV2ViR0wgYnJpZGdlXHJcbmV4cG9ydCB7IFFFQVJXZWJHTEJyaWRnZSB9IGZyb20gJy4vcWVhci13ZWJnbC1icmlkZ2UnO1xyXG5cclxuLy8gSW1wb3J0IHV0aWxpdGllc1xyXG5leHBvcnQgeyBHbGl0Y2hFbmdpbmUgfSBmcm9tICcuL2dsaXRjaC1lbmdpbmUnO1xyXG5leHBvcnQgeyBNZW1vcnlQcm90b2NvbCB9IGZyb20gJy4vbWVtb3J5LXByb3RvY29sJztcclxuZXhwb3J0IHsgVHJhdW1hSW5kZXggfSBmcm9tICcuL1RyYXVtYUluZGV4JztcclxuZXhwb3J0IHsgTG9yZUdlbmVyYXRvciB9IGZyb20gJy4vTG9yZUdlbmVyYXRvcic7XHJcblxyXG4vLyBSZWdpc3RlciBXZWIgQ29tcG9uZW50cyBpZiBub3QgYWxyZWFkeSByZWdpc3RlcmVkXHJcbmlmICghY3VzdG9tRWxlbWVudHMuZ2V0KCdxdWFudHVtLWhvbG9ncmFtJykpIHtcclxuICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZSgncXVhbnR1bS1ob2xvZ3JhbScsIEhvbG9ncmFtQ29tcG9uZW50IGFzIGFueSk7XHJcbn1cclxuXHJcbi8vIEluaXRpYWxpemUgc2VydmljZXMgd2l0aCB3ZWJwYWNrIGVudmlyb25tZW50IHZhcmlhYmxlc1xyXG5jb25zdCBERUJVR19NT0RFID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJztcclxuXHJcbi8vIEF1dG8taW5pdGlhbGl6ZSB3aGVuIHRoZSBET00gaXMgcmVhZHlcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICAgIGNvbnNvbGUuaW5mbygnQ3liZXJDb3JlIGluaXRpYWxpemVkIGluICcgKyAoREVCVUdfTU9ERSA/ICdkZXZlbG9wbWVudCcgOiAncHJvZHVjdGlvbicpICsgJyBtb2RlJyk7XHJcbiAgICBcclxuICAgIC8vIEluaXRpYWxpemUgdGhlIE5ldXJhbEJ1cyBldmVudCBzeXN0ZW1cclxuICAgIE5ldXJhbEJ1cy5pbml0aWFsaXplKCk7XHJcbiAgICBcclxuICAgIC8vIFJlZ2lzdGVyIGFsbCBjb21wb25lbnRzIHdpdGggdGhlIE5ldXJhbEJ1c1xyXG4gICAgTmV1cmFsQnVzLnJlZ2lzdGVyKCdob2xvZ3JhbS1jb21wb25lbnQnLCB7IHZlcnNpb246ICcyLjAuMCcgfSk7XHJcbiAgICBOZXVyYWxCdXMucmVnaXN0ZXIoJ2VuaGFuY2VkLWNhcnQnLCB7IHZlcnNpb246ICcyLjAuMCcgfSk7XHJcbiAgICBOZXVyYWxCdXMucmVnaXN0ZXIoJ3F1YW50dW0td2ViZ2wnLCB7IHZlcnNpb246ICcyLjAuMCcgfSk7XHJcbiAgICBcclxuICAgIC8vIFB1Ymxpc2ggaW5pdGlhbGl6YXRpb24gZXZlbnRcclxuICAgIE5ldXJhbEJ1cy5wdWJsaXNoKCdjeWJlcmNvcmU6aW5pdGlhbGl6ZWQnLCB7XHJcbiAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxyXG4gICAgICAgIGVudmlyb25tZW50OiBERUJVR19NT0RFID8gJ2RldmVsb3BtZW50JyA6ICdwcm9kdWN0aW9uJyxcclxuICAgICAgICBjb21wb25lbnRzOiBbXHJcbiAgICAgICAgICAgICdob2xvZ3JhbS1jb21wb25lbnQnLFxyXG4gICAgICAgICAgICAnZW5oYW5jZWQtY2FydCcsXHJcbiAgICAgICAgICAgICdxdWFudHVtLXdlYmdsJ1xyXG4gICAgICAgIF1cclxuICAgIH0pO1xyXG59KTsiLCIvKipcclxuICogVHlwZVNjcmlwdCB3cmFwcGVyIGZvciBtZW1vcnktcHJvdG9jb2wuanNcclxuICogUHJvdmlkZXMgdHlwZSBzYWZldHkgd2hpbGUgbWFpbnRhaW5pbmcgY29tcGF0aWJpbGl0eSB3aXRoIHRoZSBvcmlnaW5hbCBtZW1vcnkgc3lzdGVtXHJcbiAqL1xyXG5cclxuLy8gSW1wb3J0IHRoZSBvcmlnaW5hbCBKYXZhU2NyaXB0IGZpbGVcclxuY29uc3QgTWVtb3J5UHJvdG9jb2xKUyA9IHJlcXVpcmUoJy4vbWVtb3J5LXByb3RvY29sLmpzJykuZGVmYXVsdCB8fCByZXF1aXJlKCcuL21lbW9yeS1wcm90b2NvbC5qcycpO1xyXG5cclxuLy8gRGVmaW5lIFR5cGVTY3JpcHQgaW50ZXJmYWNlcyBmb3IgdGhlIE1lbW9yeVByb3RvY29sXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWVtb3J5RnJhZ21lbnQge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgdHlwZTogc3RyaW5nO1xyXG4gIGNvbnRlbnQ6IGFueTtcclxuICB0aW1lc3RhbXA6IG51bWJlcjtcclxuICB0YWdzOiBzdHJpbmdbXTtcclxuICBwcmlvcml0eTogbnVtYmVyO1xyXG4gIGV4cGlyZXNBdD86IG51bWJlcjtcclxuICBtZXRhZGF0YT86IFJlY29yZDxzdHJpbmcsIGFueT47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTWVtb3J5UXVlcnkge1xyXG4gIHRhZ3M/OiBzdHJpbmdbXTtcclxuICB0eXBlPzogc3RyaW5nO1xyXG4gIGZyb21UaW1lc3RhbXA/OiBudW1iZXI7XHJcbiAgdG9UaW1lc3RhbXA/OiBudW1iZXI7XHJcbiAgbWluUHJpb3JpdHk/OiBudW1iZXI7XHJcbiAgbGltaXQ/OiBudW1iZXI7XHJcbiAgaW5jbHVkZUV4cGlyZWQ/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1lbW9yeVByb3RvY29sSW50ZXJmYWNlIHtcclxuICAvLyBQcm9wZXJ0aWVzXHJcbiAgaXNJbml0aWFsaXplZDogYm9vbGVhbjtcclxuICBmcmFnbWVudENvdW50OiBudW1iZXI7XHJcbiAgbGFzdFN5bmNUaW1lc3RhbXA6IG51bWJlcjtcclxuICBcclxuICAvLyBNZXRob2RzXHJcbiAgaW5pdGlhbGl6ZShvcHRpb25zPzogYW55KTogUHJvbWlzZTx2b2lkPjtcclxuICBzdG9yZUZyYWdtZW50KGZyYWdtZW50OiBQYXJ0aWFsPE1lbW9yeUZyYWdtZW50Pik6IE1lbW9yeUZyYWdtZW50O1xyXG4gIHJldHJpZXZlRnJhZ21lbnQoZnJhZ21lbnRJZDogc3RyaW5nKTogTWVtb3J5RnJhZ21lbnQgfCBudWxsO1xyXG4gIHF1ZXJ5RnJhZ21lbnRzKHF1ZXJ5OiBNZW1vcnlRdWVyeSk6IE1lbW9yeUZyYWdtZW50W107XHJcbiAgcmVtb3ZlRnJhZ21lbnQoZnJhZ21lbnRJZDogc3RyaW5nKTogYm9vbGVhbjtcclxuICBjbGVhckFsbEZyYWdtZW50cygpOiB2b2lkO1xyXG4gIGV4cG9ydE1lbW9yeSgpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xyXG4gIGltcG9ydE1lbW9yeShkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogYm9vbGVhbjtcclxuICBzeW5jKCk6IFByb21pc2U8Ym9vbGVhbj47XHJcbn1cclxuXHJcbi8vIEV4cG9ydCB0aGUgSmF2YVNjcmlwdCBtb2R1bGUgd2l0aCBUeXBlU2NyaXB0IHR5cGVzXHJcbmV4cG9ydCBjb25zdCBNZW1vcnlQcm90b2NvbDogTWVtb3J5UHJvdG9jb2xJbnRlcmZhY2UgPSBNZW1vcnlQcm90b2NvbEpTOyIsIi8qKlxyXG4gKiBUeXBlU2NyaXB0IHdyYXBwZXIgZm9yIG5ldXJhbC1idXMuanNcclxuICogUHJvdmlkZXMgdHlwZSBzYWZldHkgd2hpbGUgbWFpbnRhaW5pbmcgY29tcGF0aWJpbGl0eSB3aXRoIHRoZSBvcmlnaW5hbCBldmVudCBzeXN0ZW1cclxuICovXHJcblxyXG4vLyBJbXBvcnQgdGhlIG9yaWdpbmFsIEphdmFTY3JpcHQgZmlsZVxyXG5jb25zdCBOZXVyYWxCdXNKUyA9IHJlcXVpcmUoJy4vbmV1cmFsLWJ1cy5qcycpLmRlZmF1bHQgfHwgcmVxdWlyZSgnLi9uZXVyYWwtYnVzLmpzJyk7XHJcblxyXG4vLyBEZWZpbmUgVHlwZVNjcmlwdCBpbnRlcmZhY2VzIGZvciB0aGUgTmV1cmFsQnVzXHJcbmV4cG9ydCBpbnRlcmZhY2UgRXZlbnRDYWxsYmFjayB7XHJcbiAgKGRhdGE6IGFueSk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50UmVnaXN0cmF0aW9uIHtcclxuICB2ZXJzaW9uOiBzdHJpbmc7XHJcbiAgb3B0aW9ucz86IFJlY29yZDxzdHJpbmcsIGFueT47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTmV1cmFsQnVzSW50ZXJmYWNlIHtcclxuICAvLyBDb3JlIE1ldGhvZHNcclxuICBpbml0aWFsaXplKCk6IHZvaWQ7XHJcbiAgcmVnaXN0ZXIoY29tcG9uZW50TmFtZTogc3RyaW5nLCBpbmZvOiBDb21wb25lbnRSZWdpc3RyYXRpb24pOiB2b2lkO1xyXG4gIHVucmVnaXN0ZXIoY29tcG9uZW50TmFtZTogc3RyaW5nKTogdm9pZDtcclxuICBcclxuICAvLyBFdmVudCBNZXRob2RzXHJcbiAgc3Vic2NyaWJlKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogRXZlbnRDYWxsYmFjayk6IHN0cmluZztcclxuICB1bnN1YnNjcmliZShzdWJzY3JpcHRpb25JZDogc3RyaW5nKTogYm9vbGVhbjtcclxuICBwdWJsaXNoKGV2ZW50TmFtZTogc3RyaW5nLCBkYXRhOiBhbnkpOiB2b2lkO1xyXG4gIFxyXG4gIC8vIFV0aWxpdHkgTWV0aG9kc1xyXG4gIGdldFJlZ2lzdGVyZWRDb21wb25lbnRzKCk6IHN0cmluZ1tdO1xyXG4gIGdldENvbXBvbmVudEluZm8oY29tcG9uZW50TmFtZTogc3RyaW5nKTogQ29tcG9uZW50UmVnaXN0cmF0aW9uIHwgbnVsbDtcclxuICBjbGVhckFsbFN1YnNjcmlwdGlvbnMoKTogdm9pZDtcclxuICBkaXNwb3NlKCk6IHZvaWQ7XHJcbn1cclxuXHJcbi8vIEV4cG9ydCB0aGUgSmF2YVNjcmlwdCBtb2R1bGUgd2l0aCBUeXBlU2NyaXB0IHR5cGVzXHJcbmV4cG9ydCBjb25zdCBOZXVyYWxCdXM6IE5ldXJhbEJ1c0ludGVyZmFjZSA9IE5ldXJhbEJ1c0pTOyIsIi8qKlxyXG4gKiBUeXBlU2NyaXB0IHdyYXBwZXIgZm9yIHFlYXItd2ViZ2wtYnJpZGdlLmpzXHJcbiAqIFByb3ZpZGVzIHR5cGUgc2FmZXR5IHdoaWxlIG1haW50YWluaW5nIGNvbXBhdGliaWxpdHkgd2l0aCB0aGUgb3JpZ2luYWwgV2ViR0wgYnJpZGdlXHJcbiAqL1xyXG5cclxuLy8gSW1wb3J0IHRoZSBvcmlnaW5hbCBKYXZhU2NyaXB0IGZpbGVcclxuY29uc3QgUUVBUldlYkdMQnJpZGdlSlMgPSByZXF1aXJlKCcuL3FlYXItd2ViZ2wtYnJpZGdlLmpzJykuZGVmYXVsdCB8fCByZXF1aXJlKCcuL3FlYXItd2ViZ2wtYnJpZGdlLmpzJyk7XHJcblxyXG4vLyBEZWZpbmUgVHlwZVNjcmlwdCBpbnRlcmZhY2UgZm9yIHRoZSBRRUFSIFdlYkdMIEJyaWRnZVxyXG5leHBvcnQgaW50ZXJmYWNlIFFFQVJXZWJHTEJyaWRnZUludGVyZmFjZSB7XHJcbiAgLy8gUHJvcGVydGllc1xyXG4gIGlzQ29ubmVjdGVkOiBib29sZWFuO1xyXG4gIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcclxuICBjb25uZWN0b3JUeXBlOiBzdHJpbmc7XHJcbiAgbGFzdFN5bmNUaW1lc3RhbXA6IG51bWJlcjtcclxuICBcclxuICAvLyBNZXRob2RzXHJcbiAgY29ubmVjdCh0YXJnZXRFbGVtZW50OiBIVE1MRWxlbWVudCwgb3B0aW9ucz86IGFueSk6IFByb21pc2U8Ym9vbGVhbj47XHJcbiAgZGlzY29ubmVjdCgpOiB2b2lkO1xyXG4gIHN5bmNTdGF0ZShzdGF0ZTogYW55KTogdm9pZDtcclxuICBhcHBseUVmZmVjdChlZmZlY3ROYW1lOiBzdHJpbmcsIHBhcmFtcz86IGFueSk6IHZvaWQ7XHJcbiAgcmVnaXN0ZXJFdmVudEhhbmRsZXIoZXZlbnRUeXBlOiBzdHJpbmcsIGhhbmRsZXI6IChldmVudDogYW55KSA9PiB2b2lkKTogc3RyaW5nO1xyXG4gIHVucmVnaXN0ZXJFdmVudEhhbmRsZXIoaGFuZGxlcklkOiBzdHJpbmcpOiBib29sZWFuO1xyXG4gIGdldFBlcmZvcm1hbmNlTWV0cmljcygpOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+O1xyXG59XHJcblxyXG4vLyBFeHBvcnQgdGhlIEphdmFTY3JpcHQgbW9kdWxlIHdpdGggVHlwZVNjcmlwdCB0eXBlc1xyXG5leHBvcnQgY29uc3QgUUVBUldlYkdMQnJpZGdlOiBRRUFSV2ViR0xCcmlkZ2VJbnRlcmZhY2UgPSBRRUFSV2ViR0xCcmlkZ2VKUzsiLCIvKipcclxuICogVHlwZVNjcmlwdCB3cmFwcGVyIGZvciBxdWFudHVtLXdlYmdsLmpzXHJcbiAqIFByb3ZpZGVzIHR5cGUgc2FmZXR5IHdoaWxlIG1haW50YWluaW5nIGNvbXBhdGliaWxpdHkgd2l0aCB0aGUgb3JpZ2luYWwgY29kZVxyXG4gKi9cclxuXHJcbi8vIEltcG9ydCB0aGUgb3JpZ2luYWwgSmF2YVNjcmlwdCBmaWxlXHJcbmNvbnN0IFF1YW50dW1XZWJHTENvbnRyb2xsZXJKUyA9IHJlcXVpcmUoJy4vcXVhbnR1bS13ZWJnbC5qcycpLmRlZmF1bHQgfHwgcmVxdWlyZSgnLi9xdWFudHVtLXdlYmdsLmpzJyk7XHJcblxyXG4vLyBEZWZpbmUgVHlwZVNjcmlwdCBpbnRlcmZhY2UgZm9yIHRoZSBRdWFudHVtV2ViR0xDb250cm9sbGVyXHJcbmV4cG9ydCBpbnRlcmZhY2UgUXVhbnR1bVdlYkdMQ29udHJvbGxlckludGVyZmFjZSB7XHJcbiAgLy8gUHJvcGVydGllc1xyXG4gIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcbiAgd2lkdGg6IG51bWJlcjtcclxuICBoZWlnaHQ6IG51bWJlcjtcclxuICBwYXJ0aWNsZUNvdW50OiBudW1iZXI7XHJcbiAgdHJhdW1hRmFjdG9yOiBudW1iZXI7XHJcbiAgZ2xpdGNoSW50ZW5zaXR5OiBudW1iZXI7XHJcbiAgaXNSdW5uaW5nOiBib29sZWFuO1xyXG4gIFxyXG4gIC8vIE1ldGhvZHNcclxuICBpbml0aWFsaXplKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIG9wdGlvbnM/OiBhbnkpOiBQcm9taXNlPHZvaWQ+O1xyXG4gIHN0YXJ0KCk6IHZvaWQ7XHJcbiAgc3RvcCgpOiB2b2lkO1xyXG4gIHJlc2l6ZSh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IHZvaWQ7XHJcbiAgc2V0VHJhdW1hRmFjdG9yKHZhbHVlOiBudW1iZXIpOiB2b2lkO1xyXG4gIHNldEdsaXRjaEludGVuc2l0eSh2YWx1ZTogbnVtYmVyKTogdm9pZDtcclxuICBhcHBseU11dGF0aW9uKG11dGF0aW9uUHJvZmlsZTogYW55KTogdm9pZDtcclxuICBkaXNwb3NlKCk6IHZvaWQ7XHJcbn1cclxuXHJcbi8vIEV4cG9ydCB0aGUgSmF2YVNjcmlwdCBjb21wb25lbnQgd2l0aCBUeXBlU2NyaXB0IHR5cGVzXHJcbmV4cG9ydCBjb25zdCBRdWFudHVtV2ViR0xDb250cm9sbGVyID0gUXVhbnR1bVdlYkdMQ29udHJvbGxlckpTIGFzIHtcclxuICBuZXcoKTogUXVhbnR1bVdlYkdMQ29udHJvbGxlckludGVyZmFjZTtcclxuICBnZXRJbnN0YW5jZSgpOiBRdWFudHVtV2ViR0xDb250cm9sbGVySW50ZXJmYWNlO1xyXG59OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==