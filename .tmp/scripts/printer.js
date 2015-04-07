(function() {
  var FONT;

  FONT = "bold 14pt roboto sans serif monospace";

  window.printer = function() {
    var drawContent, drawCover, getCanvas, self;
    self = {};
    self.print = function(data) {
      $("#print_output_container").empty();
      data.forEach(function(d) {
        drawCover(d);
        return drawContent(d);
      });
      return window.print();
    };
    getCanvas = function() {
      var canvas;
      canvas = $($("#canvas_template").html());
      canvas.appendTo($("#print_output_container"));
      return canvas.find("canvas")[0];
    };
    drawCover = function(d) {
      var canvas, ctx, drawMaterialFrame, drawText, setFont, values;
      canvas = getCanvas();
      ctx = canvas.getContext("2d");
      ctx.drawImage($("#cover_page_img")[0], 0, 0);
      setFont = function() {
        return ctx.font = FONT;
      };
      drawText = function(text, x, y) {
        var metric;
        ctx.save();
        metric = ctx.measureText(text);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.fillText(text, x, y);
        return ctx.restore();
      };
      values = [["" + d.size_x + " * " + d.size_y, -265, 260], ["" + d.sill + " mm", -250, 325], [d.material, -22, 260], ["" + d.glass_x + " * " + d.glass_y, -160, 325]];
      drawMaterialFrame = function() {
        ctx.font = "bold 35pt sans serif monospace";
        return ctx.fillText(d.material, 410, 250);
      };
      setFont();
      values.forEach((function(value) {
        return drawText(value[0], value[1], value[2]);
      }));
      return drawMaterialFrame();
    };
    drawContent = function(d) {
      var canvas, ctx, drawMemos, drawTextHorizontal, drawTextVertical, findImage, image, images, memos, setFont, typeImageRelation;
      images = {
        typeA: {
          name: "size_page_img_a",
          position: {
            boxOuterX: {
              x: 200,
              y: 145
            },
            boxInnerX: {
              x: 160,
              y: 220
            },
            boxOuterY: {
              x: -80,
              y: -290
            },
            boxInnerY: {
              x: -130,
              y: -195
            },
            frameOuterX: {
              x: 550,
              y: 157
            },
            frameInnerX: {
              x: 510,
              y: 210
            },
            frameOuterY: {
              x: -95,
              y: 50
            },
            frameInnerY: {
              x: -125,
              y: 130
            },
            lockFrame: {
              x: 100,
              y: 75
            },
            lockBox: {
              x: 80,
              y: -215
            }
          }
        },
        typeB: {
          name: "size_page_img_b",
          position: {
            boxOuterX: {
              x: 200,
              y: 182
            },
            boxInnerX: {
              x: 160,
              y: 255
            },
            boxOuterY: {
              x: -50,
              y: -290
            },
            boxInnerY: {
              x: -100,
              y: -195
            },
            frameOuterX: {
              x: 550,
              y: 192
            },
            frameOuterY: {
              x: -45,
              y: 130
            },
            lockFrame: {
              x: 100,
              y: 75
            },
            lockBox: {
              x: 80,
              y: -215
            }
          }
        }
      };
      typeImageRelation = {
        "1.4": "typeA",
        "1.0": "typeA",
        "0.8": "typeB"
      };
      findImage = function(material) {
        var type;
        type = typeImageRelation[String(material)];
        return images[type];
      };
      setFont = function() {
        return ctx.font = FONT;
      };
      drawTextVertical = function(text, x, y) {
        var metric;
        ctx.save();
        metric = ctx.measureText(text);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(text, x, y);
        return ctx.restore();
      };
      drawTextHorizontal = function(text, x, y) {
        return ctx.fillText(text, x, y);
      };
      image = findImage(d.material);
      canvas = getCanvas();
      ctx = canvas.getContext('2d');
      ctx.drawImage($("#" + image.name)[0], 0, 0);
      memos = [
        {
          text: d.size_x,
          position: image.position.boxOuterX,
          direction: "horizontal"
        }, {
          text: "下料尺寸 " + d.border_inner_x,
          position: image.position.boxInnerX,
          direction: "horizontal"
        }, {
          text: d.size_y,
          position: image.position.boxOuterY,
          direction: "vertical"
        }, {
          text: "下料尺寸 " + d.border_inner_y,
          position: image.position.boxInnerY,
          direction: "vertical"
        }, {
          text: d.frame_outer_x,
          position: image.position.frameOuterX,
          direction: "horizontal"
        }, {
          text: "下料尺寸 " + d.frame_inner_x,
          position: image.position.frameInnerX,
          direction: "horizontal"
        }, {
          text: d.frame_outer_y,
          position: image.position.frameOuterY,
          direction: "vertical"
        }, {
          text: "下料尺寸 " + d.frame_inner_y,
          position: image.position.frameInnerY,
          direction: "vertical"
        }, {
          text: d.lock_frame,
          position: image.position.lockFrame,
          direction: "vertical"
        }, {
          text: d.lock_border,
          position: image.position.lockBox,
          direction: "vertical"
        }
      ];
      drawMemos = function() {
        return memos.forEach((function(memo) {
          var drawMethod;
          if (memo.text && memo.position) {
            drawMethod = memo.direction === "horizontal" ? drawTextHorizontal : drawTextVertical;
            return drawMethod.call(null, memo.text, memo.position.x, memo.position.y);
          }
        }));
      };
      setFont();
      return drawMemos();
    };
    return self;
  };

}).call(this);
