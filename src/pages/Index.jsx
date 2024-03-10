import { Box, Button, Flex, FormControl, FormLabel, Input, Select, Table, Thead, Tbody, Tr, Th, Td, Text, IconButton, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaFileDownload } from "react-icons/fa";
import { useState, useRef } from "react";

const Index = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const initialData = [
    { id: 1, date: "2023-01-01", amount: 1000, type: "income", category: "salary" },
    { id: 2, date: "2023-01-02", amount: 50, type: "expense", category: "groceries" },
  ];

  const [transactions, setTransactions] = useState(initialData);
  const [tempTransaction, setTempTransaction] = useState({});
  const [filter, setFilter] = useState({ type: "", category: "", startDate: "", endDate: "" });
  const [balance, setBalance] = useState(transactions.reduce((acc, transaction) => (transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount), 0));

  const handleAddTransaction = () => {
    setTransactions([
      ...transactions,
      {
        id: transactions.length + 1,
        date: tempTransaction.date,
        amount: parseFloat(tempTransaction.amount),
        type: tempTransaction.type,
        category: tempTransaction.category,
      },
    ]);
    updateBalance();
    setTempTransaction({});
    toast({ title: "Transaction added", status: "success", duration: 3000 });
  };

  const handleEditTransaction = (id) => {
    setTransactions(transactions.map((transaction) => (transaction.id === id ? tempTransaction : transaction)));
    setTempTransaction({});
    updateBalance();
    toast({ title: "Transaction updated", status: "info", duration: 3000 });
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
    updateBalance();
    toast({ title: "Transaction deleted", status: "error", duration: 3000 });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleExportTransactions = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(transactions))}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "transactions.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const updateBalance = () => {
    setBalance(transactions.reduce((acc, transaction) => (transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount), 0));
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return (filter.type ? transaction.type === filter.type : true) && (filter.category ? transaction.category === filter.category : true) && (filter.startDate ? new Date(transaction.date) >= new Date(filter.startDate) : true) && (filter.endDate ? new Date(transaction.date) <= new Date(filter.endDate) : true);
  });

  return (
    <Box p={8}>
      <FormControl mb={4}>
        <FormLabel htmlFor="date">Date</FormLabel>
        <Input id="date" type="date" value={tempTransaction.date || ""} onChange={(e) => setTempTransaction({ ...tempTransaction, date: e.target.value })} />
        <FormLabel htmlFor="amount">Amount</FormLabel>
        <Input id="amount" type="number" value={tempTransaction.amount || ""} onChange={(e) => setTempTransaction({ ...tempTransaction, amount: e.target.value })} />
        <FormLabel htmlFor="type">Type</FormLabel>
        <Select id="type" value={tempTransaction.type || ""} onChange={(e) => setTempTransaction({ ...tempTransaction, type: e.target.value })}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
        <FormLabel htmlFor="category">Category</FormLabel>
        <Select id="category" value={tempTransaction.category || ""} onChange={(e) => setTempTransaction({ ...tempTransaction, category: e.target.value })}>
          <option value="salary">Salary</option>
          <option value="bills">Bills</option>
          <option value="groceries">Groceries</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </Select>
        <Flex justify="space-between" mt={4}>
          <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={handleAddTransaction}>
            Add Transaction
          </Button>
          <Button leftIcon={<FaFileDownload />} colorScheme="green" onClick={handleExportTransactions}>
            Export Transactions
          </Button>
        </Flex>
      </FormControl>

      <Box>
        <Text mb={2}>Filter Transactions</Text>
        <Flex mb={4}>
          <Select placeholder="Type" name="type" value={filter.type} onChange={handleFilterChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          <Select placeholder="Category" name="category" value={filter.category} onChange={handleFilterChange}>
            <option value="salary">Salary</option>
            <option value="bills">Bills</option>
            <option value="groceries">Groceries</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </Select>
          <Input placeholder="Start Date" type="date" name="startDate" value={filter.startDate} onChange={handleFilterChange} />
          <Input placeholder="End Date" type="date" name="endDate" value={filter.endDate} onChange={handleFilterChange} />
        </Flex>
      </Box>

      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl">Balance: ${balance.toFixed(2)}</Text>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Amount</Th>
            <Th>Type</Th>
            <Th>Category</Th>
            <Th isNumeric>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredTransactions.map((transaction) => (
            <Tr key={transaction.id}>
              <Td>{transaction.date}</Td>
              <Td isNumeric>{transaction.amount}</Td>
              <Td>{transaction.type}</Td>
              <Td>{transaction.category}</Td>
              <Td isNumeric>
                <IconButton icon={<FaEdit />} mr={2} onClick={() => setTempTransaction(transaction)} />
                <IconButton
                  icon={<FaTrash />}
                  colorScheme="red"
                  onClick={() => {
                    onOpen();
                    setTempTransaction(transaction);
                  }}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Transaction
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => handleDeleteTransaction(tempTransaction.id)} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Index;
