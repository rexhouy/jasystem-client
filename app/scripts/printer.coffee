FONT = "bold 14pt roboto sans serif monospace"

window.printer = () ->
        self = {}
        self.print = (data) ->
                $("#print_output_container").empty()
                data.forEach((d) ->
                        drawCover(d)
                        drawContent(d))
                window.print()

        getCanvas = () ->
                canvas = $($("#canvas_template").html())
                canvas.appendTo($("#print_output_container"))
                canvas.find("canvas")[0]

        drawCover = (d) ->
                canvas = getCanvas()
                ctx = canvas.getContext("2d")
                ctx.drawImage($("#cover_page_img")[0],0,0)

                setFont = () ->
                        ctx.font = FONT

                drawText = (text, x, y) ->
                        ctx.save()
                        metric = ctx.measureText(text)
                        ctx.translate(canvas.width/2, canvas.height/2)
                        ctx.rotate(Math.PI/2)
                        ctx.fillText(text, x, y)
                        ctx.restore()

                values = [
                        ["#{d.size_x} * #{d.size_y}", -265, 260], # size
                        ["#{d.sill} mm", -250, 325], # sill
                        [d.material, -22, 260], # material
                        ["#{d.glass_x} * #{d.glass_y}", -160, 325] # glass
                ]

                drawMaterialFrame = () ->
                        ctx.font = "bold 35pt sans serif monospace"
                        ctx.fillText(d.material, 410, 250)

                setFont()
                values.forEach ((value) ->
                        drawText(value[0], value[1], value[2]))
                drawMaterialFrame()

        drawContent = (d) ->
                images = {
                        typeA : {
                                name : "size_page_img_a",
                                position : {
                                        boxOuterX : { x : 200, y : 145 },
                                        boxInnerX : { x : 160, y : 220 },
                                        boxOuterY : { x : -80, y : -290 },
                                        boxInnerY : { x : -130, y : -195 },
                                        frameOuterX : { x : 550, y : 157 },
                                        frameInnerX : { x : 510, y : 210 },
                                        frameOuterY : { x : -95, y : 50 },
                                        frameInnerY : { x : -125, y : 130 },
                                        lockFrame : { x : 100, y : 75},
                                        lockBox : { x : 80, y : -215}
                                }
                        },
                        typeB : {
                                name : "size_page_img_b",
                                position : {
                                        boxOuterX : { x : 200, y : 182 },
                                        boxInnerX : { x : 160, y : 255 },
                                        boxOuterY : { x : -50, y : -290 },
                                        boxInnerY : { x : -100, y : -195 },
                                        frameOuterX : { x : 550, y : 192 },
                                        frameOuterY : { x : -45, y : 130 },
                                        lockFrame : { x : 100, y : 75},
                                        lockBox : { x : 80, y : -215}
                                }
                        }
                }

                typeImageRelation = {
                        "1.4" : "typeA",
                        "1.0" : "typeA",
                        "0.8" : "typeB"
                }

                findImage = (material) ->
                        type = typeImageRelation[String(material)]
                        images[type]

                setFont = () ->
                        ctx.font = FONT

                drawTextVertical = (text, x, y) ->
                        ctx.save()
                        metric = ctx.measureText(text)
                        ctx.translate(canvas.width/2, canvas.height/2)
                        ctx.rotate(-Math.PI/2)
                        ctx.fillText(text, x, y)
                        ctx.restore()

                drawTextHorizontal = (text, x, y) ->
                        ctx.fillText(text, x, y)

                image = findImage(d.material)
                canvas = getCanvas()
                ctx = canvas.getContext('2d')
                ctx.drawImage($("#"+image.name)[0],0,0)

                memos = [
                        {
                                text : d.size_x,
                                position : image.position.boxOuterX,
                                direction : "horizontal"
                        }, {
                                text : "下料尺寸 " + d.border_inner_x,
                                position : image.position.boxInnerX,
                                direction : "horizontal"
                        }, {
                                text : d.size_y,
                                position : image.position.boxOuterY,
                                direction : "vertical"
                        }, {
                                text : "下料尺寸 " + d.border_inner_y,
                                position : image.position.boxInnerY,
                                direction : "vertical"
                        }, {
                                text : d.frame_outer_x,
                                position : image.position.frameOuterX,
                                direction : "horizontal"
                        }, {
                                text : "下料尺寸 " + d.frame_inner_x,
                                position : image.position.frameInnerX,
                                direction : "horizontal"
                        }, {
                                text : d.frame_outer_y
                                position : image.position.frameOuterY,
                                direction : "vertical"
                        }, {
                                text : "下料尺寸 " + d.frame_inner_y,
                                position : image.position.frameInnerY,
                                direction : "vertical"
                        }, {
                                text :  d.lock_frame,
                                position : image.position.lockFrame,
                                direction : "vertical"
                        }, {
                                text :  d.lock_border,
                                position : image.position.lockBox,
                                direction : "vertical"
                        }
                ]

                drawMemos = () ->
                        memos.forEach ((memo) ->
                                if (memo.text && memo.position)
                                        drawMethod = if memo.direction == "horizontal" then drawTextHorizontal else drawTextVertical
                                        drawMethod.call(null, memo.text, memo.position.x, memo.position.y))

                setFont()
                drawMemos()

        self
