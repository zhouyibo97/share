const router=require("express").Router();
const dq=require("../base/db_query");
const ho=require("../base/http_output");

module.exports=router;
router.get("/list",(req,res)=>{
    const $sql=`SELECT
    *
    FROM
    class_room
    ORDER BY room_id`;

    dq($sql).then((result,fields)=>{
        ho(res).send(result);
    }).catch((error)=>{
        ho(res).internal_error(error).send();
    })
});
router.post("/create",(req,res)=>{
    const{room_name,size,remark}=req.body;
    const $sql=`
        INSERT INTO class_room(room_name,size,remark)
        VALUES(?,?,?)
    `;
    dq($sql,[room_name,size,remark]).then((result,fields)=>{
        ho(res).send(result);
    }).catch((error)=>{
        ho(res).internal_error(error).send();
    })
})
router.post("/remove",(req,res)=>{
    const {room_id}=req.body;
    const $sql=`DELETE FROM class_room WHERE room_id=?`;
    dq($sql,[room_id]).then((result,fields)=>{
        ho(res).send(result);
    }).catch((error)=>{
        ho(res).internal_error(error).send();
    })
})
router.post("/update",(req,res)=>{
    const{room_name,size,remark,room_id}=req.body;
    const $sql=`
        UPDATE class_room  SET room_name=?,size=?,remark=? WHERE room_id=?
    `;
    dq($sql,[room_name,size,remark,room_id]).then((result,fields)=>{
        ho(res).send(result);
    }).catch((error)=>{
        ho(res).internal_error(error).send();
    })

})