(function() {
  var TABLE_ID, calculate, config, getData, getValue, initTemplate, template, validate;

  TABLE_ID = "#doors_info";

  template = null;

  initTemplate = function() {
    if (template != null) {
      return template;
    }
    template = $(TABLE_ID + " > tbody tr:first-child").clone();
    if (template == null) {
      return null;
    }
    return template.find("input").each(function() {
      return this.value = "";
    });
  };

  window.addDoor = function() {
    return $(TABLE_ID + " > tbody").append(template.clone());
  };

  window.removeDoor = function(btn) {
    return $(btn).parent().parent().remove();
  };

  window.prepareData = function() {
    var setName;
    setName = function(index, that) {
      return $(that).attr("name", $(that).attr("name").replace(/[0]/, "[" + index + "]"));
    };
    return $(TABLE_ID + " > tbody > tr").each(function(index) {
      $(this).find("input").each(function() {
        return setName(index, this);
      });
      return $(this).find("select").each(function() {
        return setName(index, this);
      });
    });
  };

  validate = function(datas) {
    var attr, data, value, _i, _len;
    for (_i = 0, _len = datas.length; _i < _len; _i++) {
      data = datas[_i];
      for (attr in data) {
        value = data[attr];
        if (!value) {
          alert("数据不完整");
          return false;
        }
      }
    }
    return true;
  };

  getValue = function(datas, name) {
    var element, i, _i, _len, _ref, _results;
    _ref = document.getElementsByName(name);
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      element = _ref[i];
      datas[i] = datas[i] || {};
      _results.push(datas[i][name] = Number(element.value));
    }
    return _results;
  };

  getData = function() {
    var datas, name, _i, _len, _ref;
    datas = [];
    _ref = ["material", "size_x", "size_y", "sill", "count"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      getValue(datas, name);
    }
    if (!validate(datas)) {
      return null;
    }
    return datas;
  };

  config = {
    "0.8": {
      glass_x: 'size_x-210',
      glass_y: "size_y-sill-175",
      border_inner_x: "size_x-80",
      border_inner_y: "size_y-40",
      frame_outer_x: "size_x-205",
      frame_outer_y: "size_y-sill-33",
      frame_inner_x: "size_x-205",
      frame_inner_y: "size_y-sill-33",
      lock_frame: 997,
      lock_border: 1030
    },
    "1.0": {
      glass_x: "size_x-205",
      glass_y: "size_y-sill -173",
      border_inner_x: "size_x-80",
      border_inner_y: "size_y-40",
      frame_outer_x: "size_x-65",
      frame_outer_y: "size_y-sill-33",
      frame_inner_x: "size_x-225",
      frame_inner_y: "size_y-sill-193",
      lock_frame: 997,
      lock_border: 1030
    },
    "1.4": {
      glass_x: "size_x-240",
      glass_y: "size_y-sill-198",
      border_inner_x: "size_x-108",
      border_inner_y: "size_y-50",
      frame_outer_x: "size_x-83",
      frame_outer_y: "size_y-sill-42",
      frame_inner_x: "size_x-259",
      frame_inner_y: "size_y-sill-218",
      lock_frame: 997,
      lock_border: 1030
    }
  };

  calculate = function(data) {
    var conf, key, sill, size_x, size_y, value;
    conf = config[data.material];
    size_x = data.size_x;
    size_y = data.size_y;
    sill = data.sill;
    for (key in conf) {
      value = conf[key];
      data[key] = eval(value);
    }
    return data;
  };

  window.printDrawing = function() {
    var data, datas, _i, _len;
    datas = getData();
    if (!datas) {
      return;
    }
    for (_i = 0, _len = datas.length; _i < _len; _i++) {
      data = datas[_i];
      calculate(data);
    }
    return printer().print(datas);
  };

  window.printGlass = function() {
    var data, datas, _i, _j, _len, _len1;
    datas = getData();
    if (!datas) {
      return;
    }
    for (_i = 0, _len = datas.length; _i < _len; _i++) {
      data = datas[_i];
      calculate(data);
    }
    $("#print_output_container").empty();
    for (_j = 0, _len1 = datas.length; _j < _len1; _j++) {
      data = datas[_j];
      $("#print_output_container").append("<p>" + data.glass_x + "  *  " + data.glass_y + "</p>");
    }
    return window.print();
  };

  $(function() {
    return initTemplate();
  });

}).call(this);

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
