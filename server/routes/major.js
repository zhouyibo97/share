const router=require("express").Router();
const dq=require("../base/db_query");
const ho=require("../base/http_output");

module.exports=router;

router.get("/list",(req,res)=>{
    const $sql=`
        SELECT 
        major.major_id,
        major.major_name,
        major.lesson_list,
        major.remark,
        (SELECT SUM(lesson.length) FROM lesson WHERE INSTR(CONCAT(",",major.lesson_list,","),CONCAT(",",lesson.lesson_id,",")))AS total FROM major ORDER BY major_id
    `;
    dq($sql).then((result,fields)=>{
        ho(res).send(result);
    }).catch((error)=>{
        ho(res).internal_error().send(error);
    })
})
router.post("/create",(req,res)=>{
    const {major_name,lesson_list,remark}=req.body;
    const $sql=`INSERT INTO major(major_name,lesson_list,remark) VALUES(?,?,?)`;
    dq($sql,[major_name,lesson_list.join(","),remark]).then((result,fields)=>{
        ho(res).send(result);
    }).catch((error)=>{
        ho(res).internal_error().send(error);
    })
});
router.post("/update",(req,res)=>{
    const {major_name,lesson_list,remark,major_id}=req.body;
    const $sql=`UPDATE major SET major_name=?,lesson_list=?,remark=? WHERE major_id=?`;
    dq($sql,[major_name,lesson_list.join(","),remark,major_id]).then((result,fields)=>{
        ho(res).send(result);
    }).catch((error)=>{
        ho(res).internal_error().send(error);
    })
});
router.post("/remove",(req,res)=>{
    const {major_id}=req.body;
    const $sql=`DELETE FROM major WHERE major_id=?`;
    dq($sql,[major_id]).then((result,fields)=>{
        ho(res).send(result);
    }).catch((error)=>{
        ho(res).internal_error().send(error);
    })
})
