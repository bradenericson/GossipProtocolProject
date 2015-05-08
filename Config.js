/**
 * Created by Chad Luangrath on 5/7/2015.
 */
Buffer.prototype.toByteArray = function () {
    return Array.prototype.slice.call(this, 0);
}