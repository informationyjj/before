<template>
  <div class="container">
    <h2 class="title">查询借阅信息</h2>
    <div class="search-container">
      <input type="text" v-model="username" class="input" placeholder="请输入用户名">
      <input type="text" v-model="bookname" class="input" placeholder="请输入图书名">
      <button @click="search" class="button">查询</button>
    </div>
    <div class="result-container" v-if="borrowRecords.length">
      <h3 class="subtitle">借阅信息：</h3>
      <table class="table">
        <thead>
          <tr>
            <th>图书名称</th>
            <th>借阅时间</th>
            <th>归还时间</th>
            <th>借阅状态</th>
            <th>借阅人</th>
            <th class="text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in borrowRecords" :key="record.id">
            <td>{{ record.bookname }}</td>
            <td>{{ formatDateTime(record.lendDate) }}</td> 
            <td>{{ formatDateTime(record.backDate) }}</td>
            <td>{{ getState(record) }}</td>
            <td>{{ record.username }}</td>
            <td class="action-cell">
               <button @click="borrowBook(record)" class="button borrow-button">借阅</button>
               <button @click="returnBook(record)" class="button return-button">归还</button>
            </td>
          </tr>
        </tbody>
      </table>
      
       <div class="pagination">
        <div class="page-navigation">
          <button @click="prevPage" :disabled="currentPage === 1" class="navigation-button">上一页</button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="navigation-button">下一页</button>

          <!-- <div class="page-size-container"> -->
          <span class="st">每页显示：</span>
          <input type="text" v-model.number="pageSizeInput" class="input page-size-input" placeholder="每页记录数">
        <!-- </div> -->
        </div>
        
      </div>
    </div>
    <div v-else>
      <p class="no-record">暂无借阅信息</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      bookname: '',
      borrowRecords: [],
      currentPage: 1,
      pageSize: 10, // 默认每页显示 10 条记录
      totalRecords: 0,
      totalPages: 0,
      pageSizeInput: '', // 新增每页显示记录数的输入变量
    };
  },
  created() {
    this.getAllBorrowRecords();
  },
  watch: {
    pageSizeInput(newValue) {
      if (newValue !== '') {
        this.pageSize = parseInt(newValue);
        this.currentPage = 1; // 重置当前页为第一页
        this.getAllBorrowRecords(); // 重新获取数据
      }
    },
  },
  methods: {

    gotoPageHandler() {
      if (this.gotoPage >= 1 && this.gotoPage <= this.totalPages) {
        this.currentPage = this.gotoPage;
        this.getAllBorrowRecords();
      } else {
        alert('请输入有效的页数！');
      }
    },

    getAllBorrowRecords() {
      const params = {
        page: this.currentPage,
        size: this.pageSize
      };
      axios.get('http://localhost:8085/lend/getAll', { params })
        .then(response => {
          this.borrowRecords = response.data.data.data;
          this.totalRecords = response.data.data.totalRecords;
          this.totalPages = response.data.data.totalPages;
        })
        .catch(error => {
          console.error('Error fetching borrow records:', error);
        });
    },

nextPage() {
  console.log("hahaha");
  if (this.currentPage < this.totalPages ) {
    this.currentPage++;
    console.log("hahaha");
    this.getAllBorrowRecords();
  }
},


    search() {
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      };
      axios.post('http://localhost:8085/lend/getLendInfo', {
        username: this.username,
        bookname: this.bookname
      }, config)
      .then(response => {
        this.borrowRecords = response.data.data;
      })
      .catch(error => {
        console.error('Error fetching borrow records:', error);
      });
    },
    formatDateTime(dateTime) {
      if (!dateTime) return '';
      const date = new Date(dateTime);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const formattedMonth = month < 10 ? `0${month}` : month;
      const formattedDay = day < 10 ? `0${day}` : day;
      const formattedHour = hour < 10 ? `0${hour}` : hour;
      const formattedMinute = minute < 10 ? `0${minute}` : minute;
      return `${year}/${formattedMonth}/${formattedDay} ${formattedHour}:${formattedMinute}`;
    },
    getState(record) {
      if (record.lendDate && !record.backDate) {
        return '借阅中';
      } else if (record.lendDate && record.backDate) {
        return '已归还';
      } else {
        return '状态未知';
      }
    },
    borrowBook(record) {
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  };

  axios.post('http://localhost:8085/book/borrow', { bookname: record.bookname, username: this.username }, config)
    .then(response => {
      alert('借书成功！');
      this.getAllBorrowRecords();
      console.log(response.data);
    })
    .catch(error => {
      alert('借书失败！')
      console.error('借阅图书失败：', error);
    });

    },

    returnBook(record){
      const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  };

  axios.post('http://localhost:8085/book/return', { bookname: record.bookname}, config)
    .then(response => {
      alert('还书成功！');
      this.getAllBorrowRecords();
      console.log(response.data);
    })
    .catch(error => {
      alert('还书失败');
      console.error('还书失败：', error);
    });
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.getAllBorrowRecords();
      }
    },
    // nextPage() {
    //   if (this.currentPage < this.totalPages) {
    //     this.currentPage++;
    //     console.log("hahaha");
    //     this.getAllBorrowRecords();
    //   }
    // },
  }
};
</script>

<style scoped>

.action-cell {
  text-align: center;
}

.text-center {
  text-align: center;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}

.result-container {
  margin-top: 20px;
}

.subtitle {
  font-size: 20px;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

.no-record {
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
}

.return-button {
  background-color: #dc3545;
  background-color: #dc3545;
  margin-left: 5px; /* 添加右边距 */
}

.borrow-button {
  background-color: blue;
}

.return-button:hover {
  background-color: #bb2d3b;
}

.borrow-button:hover {
  background-color: blue;
}
.st{
  margin-left: 8px; 
}
.navigation-button{
  margin-left: 5px; 
}

</style>
