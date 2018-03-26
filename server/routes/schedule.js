const router = require("express").Router();
const dq = require("../base/db_query");
const ho = require("../base/http_output");
const async = require("async");

const moment = require("moment");

module.exports = router;

router.get("/list", (req, res) => {
    const { class_id, month } = req.query;

    const time_start = moment(month).format("YYYY/MM") + "/1";
    const time_end = moment(month).add(1, "month").format("YYYY/MM") + "/1";

    const $sql = `
    SELECT
        lesson_schedule.schedule_id,
        lesson_schedule.begin_time,
        lesson_schedule.end_time,
        lesson_schedule.room_id,
        lesson_schedule.class_id,
        lesson_schedule.lesson_id,
        class_room.room_name,
        class.class_name
    FROM
        lesson_schedule
    INNER JOIN
        class_room ON lesson_schedule.room_id= class_room.room_id
    INNER JOIN
        class ON lesson_schedule.class_id = class.class_id
    WHERE 
        lesson_schedule.class_id=? 
        AND
        lesson_schedule.begin_time >=?
        AND
        lesson_schedule.begin_time <=?

        ORDER BY lesson_schedule.begin_time ASC
    `;


    dq($sql, [class_id, time_start, time_end]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    });
});

router.post("/remove", (req, res) => {
    const { schedule_id } = req.body;
    const $sql = `DELETE FROM lesson_schedule WHERE schedule_id=?`;
    dq($sql, [schedule_id]).then((result, fields) => {
        ho(res).send(result);
    }).catch((error) => {
        ho(res).internal_error().send(error);
    });
});


router.post("/create", (req, res) => {
    //先检查数据的合理性
    let { begin_time, end_time, room_id, class_id } = req.body;

    begin_time = moment(begin_time).format("YYYY-MM-DD HH:mm:SS");
    end_time = moment(end_time).format("YYYY-MM-DD HH:mm:SS");
    room_id = Number(room_id);
    class_id = Number(class_id);
    //检查教室能不能装下个班

    async.parallel([
        //检查排课的时候，是不是已经过了目标时间,开始时间不能大于结束时间
        (callback) => {
            let nowTime = moment(new Date(Date.now())),
                b_time = moment(begin_time),
                e_time = moment(end_time);
            if (b_time <= nowTime || e_time <= nowTime) {
                callback({ message: `你不能在已经过去的时间安排课时` });
            } else if (e_time <= b_time) {
                callback({ message: `开始时间应该在结速时间之前` });
            } else {
                callback(null);
            }
        },
        //检查该时间段该班是不是已经有课了 SQL
        (callback) => {
            const $sql = `
                SELECT schedule_id FROM lesson_schedule
                WHERE (
                    (begin_time >= ?  AND begin_time <= ? ) 
                    OR
                    (end_time >= ?  AND end_time <= ? )
                ) AND class_id= ?
            `;

            dq($sql, [begin_time, end_time, begin_time, end_time, class_id]).then((results) => {
                if (results.length) {
                    callback({ message: `该时间段内这个班已经有课了` });
                } else {
                    callback(null);
                }
            }).catch((error) => {
                callback(error)
            });
        },
        //检查该时间段教室是否占用 SQL  
        (callback) => {
            const $sql = `
                SELECT schedule_id FROM lesson_schedule
                WHERE (
                    (begin_time >= ?  AND begin_time <= ? )
                    OR
                    (end_time >= ?  AND end_time <= ? )
                ) AND room_id= ?
            `;

            dq($sql, [begin_time, end_time, begin_time, end_time, room_id]).then((results) => {
                if (results.length) {
                    callback({ message: `该时间段内该教室被占用了` });
                } else {
                    callback(null);
                }
            }).catch((error) => {
                callback(error)
            });
        },
        //检查教室能不能装下个班
        (callback) => {
            const $sql = `
                SELECT 
                    size,
                    (SELECT COUNT(*) FROM student WHERE class_id=?) AS total
                FROM class_room
                WHERE room_id=?
            `;
            dq($sql, [class_id, room_id]).then((results) => {
                if (results.length) {
                    if (results[0].size < results[0].total) {
                        callback({ message: `该教室装不下这个班的学生` });
                    } else {
                        callback(null);
                    }
                } else {
                    callback(null);
                }
            }).catch((error) => {
                callback(error)
            });

        }

    ], (error, result) => {
        if (!error) {
            //没错就添加数据
            const $sql = `
                INSERT INTO lesson_schedule( begin_time, end_time, room_id, class_id )
                VALUES(?,?,?,?)
            `;

            dq($sql, [begin_time, end_time, room_id, class_id]).then((r) => {
                ho(res).send(r);
            }).catch((error) => {
                ho(res).internal_error(error).send();
            });
        } else {
            //有错就返回
            ho(res).internal_error(error).send();
        }
    });


});

