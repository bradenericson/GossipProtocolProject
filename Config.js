/**
 * Created by Chad Luangrath on 5/7/2015.
 */
 /// <reference path="typings/node/node.d.ts"/>
 
Buffer.prototype.toByteArray = function () {
    return Array.prototype.slice.call(this, 0);
};