const express = require("express");
const app = express();
const aws = require("aws-sdk");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const dynamoDB = new aws.DynamoDB.DocumentClient({
  region: "us-east-2",
  accessKeyId: "",
  secretAccessKey: "",
});

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  let params = {
    TableName: "LinhKiens",
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.err(err);
    } else {
      res.render("index", {
        dataLK: data.Items,
      });
    }
  });
});

app.post("/add", (req, res) => {
  const { ten, dvt, gia, tskt } = req.body;
  let lk = {
    maLinhKien: Math.ceil(Math.random() * 10000),
    tenLinhKien: ten,
    doViTinh: dvt,
    gia: gia,
    tskt: tskt,
  };
  let params = {
    TableName: "LinhKiens",
    Item: lk,
  };
  dynamoDB.put(params, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/");
    }
  });
});

app.post("/delete", (req, res) => {
  const { madelete } = req.body;
  let params = {
    TableName: "LinhKiens",
    Key: {
      maLinhKien: parseInt(madelete),
    },
  };
  dynamoDB.delete(params, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/");
    }
  });
});

app.post("/update", (req, res) => {
  const { ma, ten, gia, dvt, tskt } = req.body;

  let lk = {
    ma: ma,
    ten: ten,
    gia: gia,
    dvt: dvt,
    tskt: tskt,
  };


  if (ma) {
    return res.render("update", {
      data: lk,
    });
  }

  const { maup, tenup, dvtup, giaup, tsktup } = req.body;

  let params = {
    TableName: "LinhKiens",
    Key: {
      maLinhKien: parseInt(maup),
    },
    UpdateExpression:
      "set #tenLinhKien=:ten ,#doViTinh=:dvt ,#gia=:gia ,#tskt=:tskt ",
    ExpressionAttributeNames: {
      "#tenLinhKien": "tenLinhKien",
      "#doViTinh": "doViTinh",
      "#gia": "gia",
      "#tskt": "tskt",
    },
    ExpressionAttributeValues: {
      ":ten": tenup,
      ":dvt": dvtup,
      ":gia": giaup,
      ":tskt": tsktup,
    },
    ReturnValues: "UPDATED_NEW",
  };

  dynamoDB.update(params, (err, data) => {
    if (err) throw err;
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Start ${PORT}`));
