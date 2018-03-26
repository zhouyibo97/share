const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");


module.exports = router;

router.get("/list", (req, res) => {
    try {
        let { keyword, pageNumber, pageSize } = req.query;
        //预处理参数
        keyword = !!keyword ? `%${keyword}%` : `%`;
        pageNumber = Number(pageNumber);
        pageSize = Number(pageSize);

        const limitNumber = pageSize * (pageNumber - 1);
        
        //查询SQL
        const $sql_query = `SELECT
        class.class_id,
        class.class_name,
        class.major_id,
        class.remark,
        class.class_teacher_id,
        class.closed,
        (SELECT COUNT(*) FROM student WHERE student.class_id=class.class_id) AS total,
        major.major_name,
        major.lesson_list
        FROM
        class
        INNER JOIN major ON class.major_id = major.major_id
        WHERE class_name LIKE ?
        ORDER BY class_id DESC
        LIMIT ?,?
        
        `;
        //总数SQL
        const $sql_total = `
            SELECT count(*) AS total from class WHERE class_name LIKE ?
        `;
        //并行控制
        async.parallel({
            //查询列表
            list: (callback) => {
                dq($sql_query, [keyword, pageNumber, pageSize]).then((result, fields) => {
                    callback(null, result);
                }).catch((error) => {
                    callback(error);
                })
            },
            //查询总数
            total: (callback) => {
                dq($sql_total, [keyword]).then((result, fields) => {
                    callback(null, result[0].total);
                }).catch((error) => {
                    callback(error);
                })
            }
        }, (error, result) => {
            //返回结果
            if (!error) {
                ho(res).send(result);
            } else {
                ho(res).internal_error(error).send();
            }
        });
    } catch (error) {
        ho(res).internal_error().send(error);
    }

});
router.post("/create", (req, res) => {
    const { class_name, major_id, remark, closed } = req.body;
    const $sql = `
        INSERT INTO class(class_name,major_id,remark,closed)
        VALUES(?,?,?,?)
    `;
    dq($sql, [class_name, major_id, remark, closed]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    })
});

router.post("/update", (req, res) => {
    const { class_name, major_id, remark, closed, class_id } = req.body;
    const $sql = `
        UPDATE class SET class_name=?,major_id=?,remark=?,closed=?
        WHERE class_id=?
    `;
    dq($sql, [class_name, major_id, remark, closed, class_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    });
});
router.post("/remove", (req, res) => {
    const { class_id } = req.body;
    const $sql = `DELETE FROM class WHERE class_id=?`;
    dq($sql, [class_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    });
})
router.get("/all_list",(req,res)=>{
    const $sql=`
        SELECT class_name,class_id,major_id FROM class ORDER BY class_id DESC
    `;
    dq($sql).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    });
})