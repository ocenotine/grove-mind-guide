"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/hast-util-from-html-isomorphic";
exports.ids = ["vendor-chunks/hast-util-from-html-isomorphic"];
exports.modules = {

/***/ "(ssr)/./node_modules/hast-util-from-html-isomorphic/lib/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/hast-util-from-html-isomorphic/lib/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   fromHtmlIsomorphic: () => (/* binding */ fromHtmlIsomorphic)\n/* harmony export */ });\n/* harmony import */ var hast_util_from_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hast-util-from-html */ \"(ssr)/./node_modules/hast-util-from-html/lib/index.js\");\n/* harmony import */ var unist_util_remove_position__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! unist-util-remove-position */ \"(ssr)/./node_modules/unist-util-remove-position/lib/index.js\");\n/**\n * @typedef {import('hast').Root} Root\n *\n * @typedef {Pick<import('hast-util-from-html').Options, 'fragment'>} Options\n */\n\n\n\n\n/**\n * Turn HTML into a syntax tree, using browser APIs when available, so it has\n * a smaller bundle size there.\n *\n * @param {string} value\n *   Serialized HTML to parse.\n * @param {Options | null | undefined} [options]\n *   Configuration (optional).\n * @returns {Root}\n *   Tree.\n */\nfunction fromHtmlIsomorphic(value, options) {\n  const tree = (0,hast_util_from_html__WEBPACK_IMPORTED_MODULE_0__.fromHtml)(value, options)\n  ;(0,unist_util_remove_position__WEBPACK_IMPORTED_MODULE_1__.removePosition)(tree, {force: true})\n  delete tree.data\n  return tree\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaGFzdC11dGlsLWZyb20taHRtbC1pc29tb3JwaGljL2xpYi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBLGFBQWEscUJBQXFCO0FBQ2xDO0FBQ0EsYUFBYSx5REFBeUQ7QUFDdEU7O0FBRTRDO0FBQ2E7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsV0FBVyw0QkFBNEI7QUFDdkM7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNPO0FBQ1AsZUFBZSw2REFBUTtBQUN2QixFQUFFLDJFQUFjLFFBQVEsWUFBWTtBQUNwQztBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9ob21lL2p1ZGUvRG93bmxvYWRzL2dyb3ZlLW1pbmQtZ3VpZGUvbm9kZV9tb2R1bGVzL2hhc3QtdXRpbC1mcm9tLWh0bWwtaXNvbW9ycGhpYy9saWIvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdoYXN0JykuUm9vdH0gUm9vdFxuICpcbiAqIEB0eXBlZGVmIHtQaWNrPGltcG9ydCgnaGFzdC11dGlsLWZyb20taHRtbCcpLk9wdGlvbnMsICdmcmFnbWVudCc+fSBPcHRpb25zXG4gKi9cblxuaW1wb3J0IHtmcm9tSHRtbH0gZnJvbSAnaGFzdC11dGlsLWZyb20taHRtbCdcbmltcG9ydCB7cmVtb3ZlUG9zaXRpb259IGZyb20gJ3VuaXN0LXV0aWwtcmVtb3ZlLXBvc2l0aW9uJ1xuXG4vKipcbiAqIFR1cm4gSFRNTCBpbnRvIGEgc3ludGF4IHRyZWUsIHVzaW5nIGJyb3dzZXIgQVBJcyB3aGVuIGF2YWlsYWJsZSwgc28gaXQgaGFzXG4gKiBhIHNtYWxsZXIgYnVuZGxlIHNpemUgdGhlcmUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiAgIFNlcmlhbGl6ZWQgSFRNTCB0byBwYXJzZS5cbiAqIEBwYXJhbSB7T3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWR9IFtvcHRpb25zXVxuICogICBDb25maWd1cmF0aW9uIChvcHRpb25hbCkuXG4gKiBAcmV0dXJucyB7Um9vdH1cbiAqICAgVHJlZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21IdG1sSXNvbW9ycGhpYyh2YWx1ZSwgb3B0aW9ucykge1xuICBjb25zdCB0cmVlID0gZnJvbUh0bWwodmFsdWUsIG9wdGlvbnMpXG4gIHJlbW92ZVBvc2l0aW9uKHRyZWUsIHtmb3JjZTogdHJ1ZX0pXG4gIGRlbGV0ZSB0cmVlLmRhdGFcbiAgcmV0dXJuIHRyZWVcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/hast-util-from-html-isomorphic/lib/index.js\n");

/***/ })

};
;