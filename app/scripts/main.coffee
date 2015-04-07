TABLE_ID = "#doors_info"

template = null
initTemplate = () ->
        return template if template?
        # Use the first line as a template
        template = $(TABLE_ID + " > tbody tr:first-child").clone()
        return null unless template?
        template.find("input").each(() ->
                this.value = "")

window.addDoor = () ->
        $(TABLE_ID + " > tbody").append(template.clone())

window.removeDoor = (btn) ->
        $(btn).parent().parent().remove()

window.prepareData = () ->
        setName = (index, that) ->
                $(that).attr("name", $(that).attr("name").replace(/[0]/, "[#{index}]"))
        $(TABLE_ID + " > tbody > tr").each((index) ->
                $(this).find("input").each(() -> setName(index, this))
                $(this).find("select").each(() -> setName(index, this)))

validate = (datas) ->
        for data in datas
                for attr, value of data
                        unless value
                                alert("数据不完整")
                                return false
        true

getValue = (datas, name) ->
        for element, i in document.getElementsByName(name)
                 datas[i] = datas[i] || {}
                 datas[i][name] = Number(element.value)

getData = () ->
        datas = []
        getValue(datas, name) for name in ["material", "size_x", "size_y", "sill",  "count"]
        return null unless validate(datas)
        datas

config = {
        "0.8": {
                glass_x: 'size_x-210' # 玻璃宽
                glass_y: "size_y-sill-175" # 玻璃高
                border_inner_x: "size_x-80" # 框宽
                border_inner_y: "size_y-40" # 框高
                frame_outer_x: "size_x-205" # 扇外框宽
                frame_outer_y: "size_y-sill-33" # 扇外框高
                frame_inner_x: "size_x-205" # 扇内框宽
                frame_inner_y: "size_y-sill-33" # 扇内框高
                lock_frame: 997 # 锁(扇)
                lock_border: 1030 # 锁(框)
        },
        "1.0": {
                glass_x: "size_x-205" # 玻璃宽
                glass_y: "size_y-sill -173" # 玻璃高
                border_inner_x: "size_x-80" # 框宽
                border_inner_y: "size_y-40" # 框高
                frame_outer_x: "size_x-65" # 扇外框宽
                frame_outer_y: "size_y-sill-33" # 扇外框高
                frame_inner_x: "size_x-225" # 扇内框宽
                frame_inner_y: "size_y-sill-193" # 扇内框高
                lock_frame: 997 # 锁(扇)
                lock_border: 1030 # 锁(框)
        },
        "1.4": {
                glass_x: "size_x-240" # 玻璃宽
                glass_y: "size_y-sill-198" # 玻璃高
                border_inner_x: "size_x-108" # 框宽
                border_inner_y: "size_y-50" # 框高
                frame_outer_x: "size_x-83" # 扇外框宽
                frame_outer_y: "size_y-sill-42" # 扇外框高
                frame_inner_x: "size_x-259" # 扇内框宽
                frame_inner_y: "size_y-sill-218" # 扇内框高
                lock_frame: 997 # 锁(扇)
                lock_border: 1030 # 锁(框)
        }
}

calculate = (data) ->
        conf = config[data.material]
        size_x = data.size_x
        size_y = data.size_y
        sill = data.sill
        for key, value of conf
                data[key] = eval(value)
        data


window.printDrawing = () ->
        datas = getData()
        return unless datas
        calculate(data) for data in datas
        printer().print(datas)

window.printGlass = () ->
        datas = getData()
        return unless datas
        calculate(data) for data in datas
        $("#print_output_container").empty()
        $("#print_output_container").append("<p>#{data.glass_x}  *  #{data.glass_y}</p>") for data in datas
        window.print()

$ () ->
        initTemplate()
