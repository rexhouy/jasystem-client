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
