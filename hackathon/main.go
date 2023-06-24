package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/oklog/ulid/v2"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	//"context"
	"math/rand"
	"time"
)

type UserResForHTTPGet struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	Age  int    `json:"age"`
}
type SendMessageResForHTTPGet struct {
	Id         string `json:"id"`
	EditorName string `json:"editorname"`
	Content    string `json:"content"`
	Edited     string   `json:"edited"`
}

// ① GoプログラムからMySQLへ接続
var db *sql.DB

func init() {
	// ①-1
	// DB接続のための準備
	mysqlUser := os.Getenv("MYSQL_USER")
	mysqlPwd := os.Getenv("MYSQL_PWD")
	mysqlHost := os.Getenv("MYSQL_HOST")
	mysqlDatabase := os.Getenv("MYSQL_DATABASE")

	fmt.Printf("MYSQL_USER:%s", mysqlUser)

	//connStr := fmt.Sprintf("%s:%s@%s/%s?parseTime=true", mysqlUser, mysqlPwd, mysqlHost, mysqlDatabase)
	connStr := fmt.Sprintf("%s:%s@%s/%s", mysqlUser, mysqlPwd, mysqlHost, mysqlDatabase)
	_db, err := sql.Open("mysql", connStr)
	if err != nil {
		log.Fatalf("fail: sql.Open, %v\n", err)
	}

	// ①-3
	if err := _db.Ping(); err != nil {
		log.Fatalf("fail: _db.Ping, %v\n", err.Error())
	}
	db = _db
}

// ② /userでリクエストされたらnameパラメーターと一致する名前を持つレコードをJSON形式で返す
func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT,PATCH")
	w.Header().Set("Content-Type", "application/json")
	switch r.Method {
	case http.MethodOptions:
		w.WriteHeader(http.StatusOK)
		return
	case http.MethodDelete:

		// id := r.URL.Query().Get("id")
		// if id == "" {
		// 	log.Println("fail: content is empty")
		// 	w.WriteHeader(http.StatusBadRequest)
		// 	return
		// }
		type Delete struct {
			Id string `json:"id"`
		}
		var delete Delete
		json.NewDecoder(r.Body).Decode(&delete)
		id := delete.Id

		_, err := db.Query("DELETE FROM message WHERE id = ?", id)
		if err != nil {
			log.Printf("fail: db.Query, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	case http.MethodPatch:

		type UpdateMessage struct {
			Id      string `json:"id"`
			Content string `json:"content"`
			Edited  string `json:"edited"`
		}

		var updatemessage UpdateMessage
		json.NewDecoder(r.Body).Decode(&updatemessage)
		id := updatemessage.Id
		content := updatemessage.Content
		edited := updatemessage.Edited

		//query:="insert into`user`(`id`,`name`,`age`)values (id,name,age)"
		//_,err:=db.ExecContext(context.Background(),query)
		_, err := db.Exec("UPDATE message SET content=?,edited=? WHERE id=?", content, edited, id)
		if err != nil {
			log.Fatalf("impossible update message:%s", err)
			return
		}

		// type responseMessage struct {
		// 	Message string `json:"message"`
		// }
		// bytes, err := json.Marshal(responseMessage{
		// 	Message: fmt.Sprintf("Id=%v", id),
		// })
		// if err != nil {
		// 	w.WriteHeader(http.StatusInternalServerError)
		// 	return
		// }
		// w.Write(bytes)
		// w.WriteHeader(http.StatusOK)

	case http.MethodGet:
		// ②-1
		// content := r.URL.Query().Get("content") // To be filled
		// if content == "" {
		// 	log.Println("fail: content is empty")
		// 	w.WriteHeader(http.StatusBadRequest)
		// 	return
		// }

		// ②-2
		//rows, err := db.Query("SELECT id, name, age FROM user WHERE name = ?", name)
		//if err != nil {
		//	log.Printf("fail: db.Query, %v\n", err)
		//	w.WriteHeader(http.StatusInternalServerError)
		//	return
		//}
		rows, err := db.Query("SELECT * FROM message")
		if err != nil {
			log.Printf("fail: db.Query, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		// ②-3
		contents := make([]SendMessageResForHTTPGet, 0)
		//
		for rows.Next() {
			var s SendMessageResForHTTPGet
			if err := rows.Scan(&s.Id, &s.EditorName, &s.Content, &s.Edited); err != nil {
				log.Printf("fail: rows.Scan, %v\n", err)

				if err := rows.Close(); err != nil { // 500を返して終了するが、その前にrowsのClose処理が必要
					log.Printf("fail: rows.Close(), %v\n", err)
				}
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			contents = append(contents, s)
		}

		// ②-4
		bytes, err := json.Marshal(contents)
		if err != nil {
			log.Printf("fail: json.Marshal, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(bytes)
	case http.MethodPost:
		//type User struct {
		//	Name string `json:"name"`
		//	Age  int    `json:"age"`
		//}
		type SendMessage struct {
			Id         string `json:"id"`
			EditorName string `json:"editorname"`
			Content    string `json:"content"`
			Edited     bool   `json:"edited"`
		}

		fmt.Println(r)
		//var user User
		//fmt.Println(user)
		//json.NewDecoder(r.Body).Decode(&user)

		var sendmessage SendMessage
		fmt.Println(sendmessage)
		json.NewDecoder(r.Body).Decode(&sendmessage)
		editorname := sendmessage.EditorName
		content := sendmessage.Content
		edited := sendmessage.Edited

		t := time.Now()
		entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
		n := ulid.MustNew(ulid.Timestamp(t), entropy)
		id := n.String()
		//if utf8.RuneCountInString(name) > 50 {
		//	w.WriteHeader(http.StatusBadRequest)
		//	return
		//}
		//if age < 20 || 80 < age {
		//	w.WriteHeader(http.StatusBadRequest)
		//	return
		//}

		fmt.Println(editorname, content, edited, id)

		//query:="insert into`user`(`id`,`name`,`age`)values (id,name,age)"
		//_,err:=db.ExecContext(context.Background(),query)
		_, err := db.Exec("INSERT INTO message (id, editorname, content,edited) VALUES(?, ?, ?,?)", id, editorname, content, edited)
		if err != nil {
			log.Fatalf("impossible insert message:%s", err)
			return
		}
		if err != nil {
			log.Fatalf("impossible to retriece last inserted id:%s", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		type responseMessage struct {
			Message string `json:"message"`
		}
		bytes, err := json.Marshal(responseMessage{
			Message: fmt.Sprintf("Id=%v", id),
		})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Write(bytes)
		w.WriteHeader(http.StatusOK)

	default:
		log.Printf("fail: HTTP Method is %s\n", r.Method)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
}

func main() {
	// ② /userでリクエストされたらnameパラメーターと一致する名前を持つレコードをJSON形式で返す
	http.HandleFunc("/user", handler)

	// ③ Ctrl+CでHTTPサーバー停止時にDBをクローズする
	closeDBWithSysCall()

	// 8000番ポートでリクエストを待ち受ける
	log.Println("Listening...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

// ③ Ctrl+CでHTTPサーバー停止時にDBをクローズする
func closeDBWithSysCall() {
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGTERM, syscall.SIGINT)
	go func() {
		s := <-sig
		log.Printf("received syscall, %v", s)

		if err := db.Close(); err != nil {
			log.Fatal(err)
		}
		log.Printf("success: db.Close()")
		os.Exit(0)
	}()
}
