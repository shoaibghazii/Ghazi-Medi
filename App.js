import React, { useState, useEffect, useCallback } from 'react';

// Main App Component
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // State for all data, initialized from localStorage or empty arrays
    const [inventory, setInventory] = useState(() => {
        try {
            const storedInventory = localStorage.getItem('ghazi_inventory');
            return storedInventory ? JSON.parse(storedInventory) : [];
        } catch (error) {
            console.error("Failed to parse inventory from localStorage:", error);
            return [];
        }
    });
    const [sales, setSales] = useState(() => {
        try {
            const storedSales = localStorage.getItem('ghazi_sales');
            return storedSales ? JSON.parse(storedSales) : [];
        }
        catch (error) {
            console.error("Failed to parse sales from localStorage:", error);
            return [];
        }
    });
    const [recoveries, setRecoveries] = useState(() => {
        try {
            const storedRecoveries = localStorage.getItem('ghazi_recoveries');
            return storedRecoveries ? JSON.parse(storedRecoveries) : [];
        } catch (error) {
            console.error("Failed to parse recoveries from localStorage:", error);
            return [];
        }
    });
    const [expenses, setExpenses] = useState(() => {
        try {
            const storedExpenses = localStorage.getItem('ghazi_expenses');
            return storedExpenses ? JSON.parse(storedExpenses) : [];
        } catch (error) {
            console.error("Failed to parse expenses from localStorage:", error);
            return [];
        }
    });

    // Effect to save data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('ghazi_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('ghazi_sales', JSON.stringify(sales));
    }, [sales]);

    useEffect(() => {
        localStorage.setItem('ghazi_recoveries', JSON.stringify(recoveries));
    }, [recoveries]);

    useEffect(() => {
        localStorage.setItem('ghazi_expenses', JSON.stringify(expenses));
    }, [expenses]);

    // Render either LoginPage or Dashboard based on login status
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
            {isLoggedIn ? (
                <Dashboard
                    inventory={inventory}
                    setInventory={setInventory}
                    sales={sales}
                    setSales={setSales}
                    recoveries={recoveries}
                    setRecoveries={setRecoveries}
                    expenses={expenses}
                    setExpenses={setExpenses}
                    setIsLoggedIn={setIsLoggedIn}
                />
            ) : (
                <LoginPage setIsLoggedIn={setIsLoggedIn} />
            )}
        </div>
    );
}

// Login Page Component
function LoginPage({ setIsLoggedIn }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        // Hardcoded password as per requirement
        if (password === 'Ghazi786') {
            setIsLoggedIn(true);
        } else {
            setError('Incorrect password. Please try again.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-xl w-96 border border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Ghazi Veterinary and Medical Store</h2>
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                    Password:
                </label>
                <input
                    type="password"
                    id="password"
                    className="shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') handleLogin();
                    }}
                />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
            >
                Login
            </button>
            <p className="text-center text-gray-500 text-xs mt-6">
                &copy; 2025 Ghazi Veterinary and Medical Store. All rights reserved.
            </p>
        </div>
    );
}

// Dashboard Component (Main Application Layout)
function Dashboard({ inventory, setInventory, sales, setSales, recoveries, setRecoveries, expenses, setExpenses, setIsLoggedIn }) {
    const [activeTab, setActiveTab] = useState('inventory'); // Default active tab

    const renderContent = () => {
        switch (activeTab) {
            case 'inventory':
                return <InventoryManager inventory={inventory} setInventory={setInventory} />;
            case 'billing':
                return <BillingSection inventory={inventory} setInventory={setInventory} sales={sales} setSales={setSales} />;
            case 'reports':
                return <FinancialReports recoveries={recoveries} setRecoveries={setRecoveries} expenses={expenses} setExpenses={setExpenses} sales={sales} />;
            case 'search':
                return <SearchReports sales={sales} recoveries={recoveries} expenses={expenses} />;
            default:
                return <h2 className="text-xl font-semibold text-gray-700">Welcome to Ghazi Veterinary and Medical Store!</h2>;
        }
    };

    return (
        <div className="flex w-full max-w-6xl h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-gray-800 text-white p-6 flex flex-col justify-between rounded-l-lg">
                <div>
                    <h1 className="text-2xl font-bold mb-8 text-center border-b border-gray-700 pb-4">Ghazi Store</h1>
                    <nav>
                        <ul>
                            <NavItem label="Inventory" icon="" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
                            <NavItem label="Billing" icon="" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
                            <NavItem label="Daily Reports" icon="" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
                            <NavItem label="Search Records" icon="" active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
                        </ul>
                    </nav>
                </div>
                <button
                    onClick={() => setIsLoggedIn(false)}
                    className="flex items-center justify-center py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition duration-200 ease-in-out"
                >
                    <span className="mr-2"></span> Logout
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 overflow-auto">
                {renderContent()}
            </div>
        </div>
    );
}

// Navigation Item Component for Dashboard Sidebar
function NavItem({ label, icon, active, onClick }) {
    return (
        <li className="mb-2">
            <button
                className={`flex items-center w-full py-2 px-4 rounded-md text-left transition duration-200 ease-in-out
                    ${active ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
                onClick={onClick}
            >
                <span className="mr-3">{icon}</span> {label}
            </button>
        </li>
    );
}

// Inventory Management Component
function InventoryManager({ inventory, setInventory }) {
    const [newItem, setNewItem] = useState({
        name: '',
        batch: '',
        quantity: '',
        purchasePrice: '',
        sellingPrice: '',
        expiryDate: '', //YYYY-MM-DD format
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    // Function to handle input changes for new item form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    // Function to add a new item to inventory
    const handleAddItem = () => {
        // Basic validation
        if (!newItem.name || !newItem.batch || !newItem.quantity || !newItem.purchasePrice || !newItem.sellingPrice || !newItem.expiryDate) {
            setMessage('Please fill in all fields.');
            setMessageType('error');
            return;
        }
        if (isNaN(newItem.quantity) || isNaN(newItem.purchasePrice) || isNaN(newItem.sellingPrice) || parseFloat(newItem.quantity) <= 0) {
            setMessage('Quantity, Purchase Price, and Selling Price must be valid positive numbers.');
            setMessageType('error');
            return;
        }

        // Expiry date validation (must be a future date)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        const expiry = new Date(newItem.expiryDate);
        expiry.setHours(0, 0, 0, 0); // Normalize to start of day

        if (expiry < today) {
            setMessage('Expiry Date must be today or a future date.');
            setMessageType('error');
            return;
        }

        const id = Date.now(); // Simple unique ID
        setInventory(prev => [...prev, { ...newItem, id, quantity: parseFloat(newItem.quantity) }]);
        setNewItem({ name: '', batch: '', quantity: '', purchasePrice: '', sellingPrice: '', expiryDate: '' }); // Clear form
        setMessage('Item added successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Inventory Management</h2>

            {/* Add New Item Form */}
            <div className="mb-8 p-4 border border-blue-200 rounded-md bg-blue-50">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">Add New Medicine</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-1">Medicine Name:</label>
                        <input type="text" id="name" name="name" value={newItem.name} onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="batch" className="block text-gray-700 text-sm font-semibold mb-1">Batch Number:</label>
                        <input type="text" id="batch" name="batch" value={newItem.batch} onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="quantity" className="block text-gray-700 text-sm font-semibold mb-1">Quantity:</label>
                        <input type="number" id="quantity" name="quantity" value={newItem.quantity} onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="purchasePrice" className="block text-gray-700 text-sm font-semibold mb-1">Purchase Price (per unit):</label>
                        <input type="number" id="purchasePrice" name="purchasePrice" value={newItem.purchasePrice} onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="sellingPrice" className="block text-gray-700 text-sm font-semibold mb-1">Selling Price (per unit):</label>
                        <input type="number" id="sellingPrice" name="sellingPrice" value={newItem.sellingPrice} onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-semibold mb-1">Expiry Date (Compulsory):</label>
                        <input type="date" id="expiryDate" name="expiryDate" value={newItem.expiryDate} onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
                {message && (
                    <p className={`text-center py-2 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </p>
                )}
                <button onClick={handleAddItem}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out">
                    Add Item to Inventory
                </button>
            </div>

            {/* Current Inventory List */}
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Current Inventory</h3>
            <div className="overflow-x-auto rounded-md border border-gray-300">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inventory.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">No items in inventory.</td>
                            </tr>
                        ) : (
                            inventory.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.batch}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">PKR {parseFloat(item.sellingPrice).toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.expiryDate}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Billing Section Component
function BillingSection({ inventory, setInventory, sales, setSales }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [billItems, setBillItems] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Filter inventory based on search term
    useEffect(() => {
        if (searchTerm.length > 2) { // Start filtering after 2 characters
            setFilteredInventory(
                inventory.filter(item =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.batch.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredInventory([]);
        }
    }, [searchTerm, inventory]);

    // Add item to the current bill
    const handleAddToBill = (item) => {
        // Check if item is already in bill, if so, increment quantity
        const existingItemIndex = billItems.findIndex(bi => bi.id === item.id);
        if (existingItemIndex > -1) {
            const updatedBillItems = [...billItems];
            updatedBillItems[existingItemIndex].soldQuantity += 1;
            updatedBillItems[existingItemIndex].total = updatedBillItems[existingItemIndex].soldQuantity * updatedBillItems[existingItemIndex].unitPrice;
            setBillItems(updatedBillItems);
        } else {
            // Add new item to bill
            setBillItems(prev => [
                ...prev,
                {
                    id: item.id,
                    name: item.name,
                    batch: item.batch,
                    expiryDate: item.expiryDate,
                    unitPrice: parseFloat(item.sellingPrice),
                    soldQuantity: 1,
                    total: parseFloat(item.sellingPrice)
                }
            ]);
        }
        setSearchTerm(''); // Clear search after adding
    };

    // Handle quantity change for an item in the bill
    const handleBillItemQuantityChange = (id, newQuantity) => {
        setBillItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, soldQuantity: newQuantity, total: newQuantity * item.unitPrice }
                    : item
            )
        );
    };

    // Remove item from bill
    const handleRemoveBillItem = (id) => {
        setBillItems(prev => prev.filter(item => item.id !== id));
    };

    // Process the sale
    const handleProcessSale = () => {
        if (billItems.length === 0) {
            setMessage('Please add items to the bill before processing.');
            setMessageType('error');
            return;
        }

        const newInventory = [...inventory];
        const soldItemsForRecord = [];
        let isValidSale = true;

        // Validate quantities and expiry dates before processing
        for (const billItem of billItems) {
            const inventoryItem = newInventory.find(item => item.id === billItem.id);

            if (!inventoryItem || inventoryItem.quantity < billItem.soldQuantity) {
                setMessage(`Not enough stock for ${billItem.name} (Batch: ${billItem.batch}). Available: ${inventoryItem ? inventoryItem.quantity : 0}, Requested: ${billItem.soldQuantity}`);
                setMessageType('error');
                isValidSale = false;
                break;
            }

            // Expiry date check
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expiry = new Date(inventoryItem.expiryDate);
            expiry.setHours(0, 0, 0, 0);

            if (expiry < today) {
                setMessage(`Cannot sell expired medicine: ${billItem.name} (Batch: ${billItem.batch}). Expired on: ${inventoryItem.expiryDate}`);
                setMessageType('error');
                isValidSale = false;
                break;
            }
        }

        if (!isValidSale) {
            setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
            return;
        }

        // If all validations pass, proceed with sale
        for (const billItem of billItems) {
            const inventoryItem = newInventory.find(item => item.id === billItem.id);
            inventoryItem.quantity -= billItem.soldQuantity;
            soldItemsForRecord.push({
                itemId: billItem.id,
                name: billItem.name,
                batch: billItem.batch,
                quantity: billItem.soldQuantity,
                unitPrice: billItem.unitPrice,
                total: billItem.total
            });
        }

        const grandTotal = billItems.reduce((sum, item) => sum + item.total, 0);
        const newSale = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0], //YYYY-MM-DD
            items: soldItemsForRecord,
            grandTotal: grandTotal.toFixed(2)
        };

        setInventory(newInventory); // Update inventory
        setSales(prev => [...prev, newSale]); // Add new sale record

        setBillItems([]); // Clear bill
        setMessage('Sale processed successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
    };

    const grandTotal = billItems.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Billing Section</h2>

            {/* Medicine Search and Selection */}
            <div className="mb-6 p-4 border border-green-200 rounded-md bg-green-50">
                <h3 className="text-xl font-semibold mb-4 text-green-800">Add Medicine to Bill</h3>
                <input
                    type="text"
                    placeholder="Search medicine by name or batch..."
                    className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500 mb-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {filteredInventory.length > 0 && (
                    <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredInventory.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{item.batch}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">PKR {parseFloat(item.sellingPrice).toFixed(2)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{item.quantity}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right">
                                            <button onClick={() => handleAddToBill(item)}
                                                className="bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded-md transition duration-200 ease-in-out">
                                                Add
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Current Bill Items */}
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Current Bill</h3>
            <div className="overflow-x-auto rounded-md border border-gray-300 mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {billItems.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">No items in current bill.</td>
                            </tr>
                        ) : (
                            billItems.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.batch}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">PKR {item.unitPrice.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.soldQuantity}
                                            onChange={(e) => handleBillItemQuantityChange(item.id, parseInt(e.target.value))}
                                            className="w-20 p-1 border rounded-md text-center"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">PKR {item.total.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button onClick={() => handleRemoveBillItem(item.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md transition duration-200 ease-in-out">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bill Summary and Actions */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Grand Total: PKR {grandTotal.toFixed(2)}</h3>
                <button onClick={handleProcessSale}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-md transition duration-200 ease-in-out">
                    Process Sale
                </button>
            </div>
            {message && (
                <p className={`text-center py-2 rounded-md mt-4 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

// Financial Reports Component (Daily Reports, Recoveries, Expenses)
function FinancialReports({ sales, recoveries, setRecoveries, expenses, setExpenses }) {
    const [activeSection, setActiveSection] = useState('daily'); // 'daily', 'recoveries', 'expenses'
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]); // Today's date
    const [newRecovery, setNewRecovery] = useState({ date: new Date().toISOString().split('T')[0], amount: '', source: '', description: '' });
    const [newExpense, setNewExpense] = useState({ date: new Date().toISOString().split('T')[0], amount: '', category: '', description: '' });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleAddRecovery = () => {
        if (!newRecovery.amount || isNaN(newRecovery.amount) || parseFloat(newRecovery.amount) <= 0 || !newRecovery.source) {
            setMessage('Please enter a valid amount and source for recovery.');
            setMessageType('error');
            return;
        }
        setRecoveries(prev => [...prev, { ...newRecovery, id: Date.now(), amount: parseFloat(newRecovery.amount) }]);
        setNewRecovery({ date: new Date().toISOString().split('T')[0], amount: '', source: '', description: '' });
        setMessage('Recovery added successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleAddExpense = () => {
        if (!newExpense.amount || isNaN(newExpense.amount) || parseFloat(newExpense.amount) <= 0 || !newExpense.category) {
            setMessage('Please enter a valid amount and category for expense.');
            setMessageType('error');
            return;
        }
        setExpenses(prev => [...prev, { ...newExpense, id: Date.now(), amount: parseFloat(newExpense.amount) }]);
        setNewExpense({ date: new Date().toISOString().split('T')[0], amount: '', category: '', description: '' });
        setMessage('Expense added successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
    };

    // Filter sales, recoveries, and expenses for the selected report date
    const dailySales = sales.filter(sale => sale.date === reportDate);
    const dailyRecoveries = recoveries.filter(rec => rec.date === reportDate);
    const dailyExpenses = expenses.filter(exp => exp.date === reportDate);

    const totalDailySales = dailySales.reduce((sum, sale) => sum + parseFloat(sale.grandTotal), 0);
    const totalDailyRecoveries = dailyRecoveries.reduce((sum, rec) => sum + rec.amount, 0);
    const totalDailyExpenses = dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    // Updated calculation: Subtract both recoveries and expenses from sales
    const dailyNet = (totalDailySales - totalDailyRecoveries - totalDailyExpenses).toFixed(2);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Financial Reports</h2>

            {/* Section Navigation */}
            <div className="mb-6 flex space-x-4 border-b pb-4">
                <button
                    className={`py-2 px-4 rounded-md font-semibold ${activeSection === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setActiveSection('daily')}
                >
                    Daily Report
                </button>
                <button
                    className={`py-2 px-4 rounded-md font-semibold ${activeSection === 'recoveries' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setActiveSection('recoveries')}
                >
                    Add Recoveries
                </button>
                <button
                    className={`py-2 px-4 rounded-md font-semibold ${activeSection === 'expenses' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setActiveSection('expenses')}
                >
                    Add Expenses
                </button>
            </div>

            {message && (
                <p className={`text-center py-2 rounded-md mb-4 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </p>
            )}

            {/* Daily Report Section */}
            {activeSection === 'daily' && (
                <div className="p-4 border border-indigo-200 rounded-md bg-indigo-50">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-800">Daily Report Summary</h3>
                    <div className="mb-4">
                        <label htmlFor="reportDate" className="block text-gray-700 text-sm font-semibold mb-1">Select Date:</label>
                        <input type="date" id="reportDate" value={reportDate} onChange={(e) => setReportDate(e.target.value)}
                            className="p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                            <p className="text-gray-600">Total Sales:</p>
                            <p className="text-2xl font-bold text-green-600">PKR {totalDailySales.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                            <p className="text-gray-600">Total Recoveries:</p>
                            <p className="text-2xl font-bold text-blue-600">PKR {totalDailyRecoveries.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                            <p className="text-gray-600">Total Expenses:</p>
                            <p className="text-2xl font-bold text-red-600">PKR {totalDailyExpenses.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 text-center">
                        <p className="text-gray-600">Daily Net:</p>
                        <p className="text-3xl font-bold text-purple-700">PKR {dailyNet}</p>
                    </div>

                    <h4 className="text-lg font-semibold mt-6 mb-3 text-indigo-800">Sales for {reportDate}</h4>
                    <div className="overflow-x-auto rounded-md border border-gray-300 mb-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Sold</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dailySales.length === 0 ? (
                                    <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No sales for this date.</td></tr>
                                ) : (
                                    dailySales.map(sale => (
                                        <tr key={sale.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{sale.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {sale.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">PKR {sale.grandTotal}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <h4 className="text-lg font-semibold mt-6 mb-3 text-indigo-800">Recoveries for {reportDate}</h4>
                    <div className="overflow-x-auto rounded-md border border-gray-300 mb-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dailyRecoveries.length === 0 ? (
                                    <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No recoveries for this date.</td></tr>
                                ) : (
                                    dailyRecoveries.map(rec => (
                                        <tr key={rec.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{rec.source}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">PKR {rec.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{rec.description}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <h4 className="text-lg font-semibold mt-6 mb-3 text-indigo-800">Expenses for {reportDate}</h4>
                    <div className="overflow-x-auto rounded-md border border-gray-300">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dailyExpenses.length === 0 ? (
                                    <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No expenses for this date.</td></tr>
                                ) : (
                                    dailyExpenses.map(exp => (
                                        <tr key={exp.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{exp.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">PKR {exp.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{exp.description}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Recoveries Section */}
            {activeSection === 'recoveries' && (
                <div className="p-4 border border-blue-200 rounded-md bg-blue-50">
                    <h3 className="text-xl font-semibold mb-4 text-blue-800">Add New Recovery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="recDate" className="block text-gray-700 text-sm font-semibold mb-1">Date:</label>
                            <input type="date" id="recDate" name="date" value={newRecovery.date} onChange={(e) => setNewRecovery(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="recAmount" className="block text-gray-700 text-sm font-semibold mb-1">Amount:</label>
                            <input type="number" id="recAmount" name="amount" value={newRecovery.amount} onChange={(e) => setNewRecovery(prev => ({ ...prev, amount: e.target.value }))}
                                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="recSource" className="block text-gray-700 text-sm font-semibold mb-1">Source/Company:</label>
                            <input type="text" id="recSource" name="source" value={newRecovery.source} onChange={(e) => setNewRecovery(prev => ({ ...prev, source: e.target.value }))}
                                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="recDescription" className="block text-gray-700 text-sm font-semibold mb-1">Description (Optional):</label>
                            <textarea id="recDescription" name="description" value={newRecovery.description} onChange={(e) => setNewRecovery(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                    </div>
                    <button onClick={handleAddRecovery}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out">
                        Add Recovery
                    </button>
                </div>
            )}

            {/* Add Expenses Section */}
            {activeSection === 'expenses' && (
                <div className="p-4 border border-red-200 rounded-md bg-red-50">
                    <h3 className="text-xl font-semibold mb-4 text-red-800">Add New Expense</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="expDate" className="block text-gray-700 text-sm font-semibold mb-1">Date:</label>
                            <input type="date" id="expDate" name="date" value={newExpense.date} onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div>
                            <label htmlFor="expAmount" className="block text-gray-700 text-sm font-semibold mb-1">Amount:</label>
                            <input type="number" id="expAmount" name="amount" value={newExpense.amount} onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                                className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="expCategory" className="block text-gray-700 text-sm font-semibold mb-1">Category:</label>
                            <input type="text" id="expCategory" name="category" value={newExpense.category} onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="expDescription" className="block text-gray-700 text-sm font-semibold mb-1">Description (Optional):</label>
                            <textarea id="expDescription" name="description" value={newExpense.description} onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full p-2 border rounded-md focus:ring-red-500 focus:border-red-500"></textarea>
                        </div>
                    </div>
                    <button onClick={handleAddExpense}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out">
                        Add Expense
                    </button>
                </div>
            )}
        </div>
    );
}

// Search Reports Component
function SearchReports({ sales, recoveries, expenses }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredSales, setFilteredSales] = useState([]);
    const [filteredRecoveries, setFilteredRecoveries] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [message, setMessage] = useState('');

    const handleSearch = () => {
        if (!startDate || !endDate) {
            setMessage('Please select both start and end dates for the search.');
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setMessage('Start date cannot be after end date.');
            return;
        }

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        setFilteredSales(sales.filter(sale => {
            const saleDate = new Date(sale.date);
            saleDate.setHours(0, 0, 0, 0);
            return saleDate >= start && saleDate <= end;
        }));

        setFilteredRecoveries(recoveries.filter(rec => {
            const recDate = new Date(rec.date);
            recDate.setHours(0, 0, 0, 0);
            return recDate >= start && recDate <= end;
        }));

        setFilteredExpenses(expenses.filter(exp => {
            const expDate = new Date(exp.date);
            expDate.setHours(0, 0, 0, 0);
            return expDate >= start && expDate <= end;
        }));
        setMessage('');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Previous Results</h2>

            {/* Date Range Selection */}
            <div className="mb-6 p-4 border border-orange-200 rounded-md bg-orange-50">
                <h3 className="text-xl font-semibold mb-4 text-orange-800">Select Date Range</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="startDate" className="block text-gray-700 text-sm font-semibold mb-1">From Date:</label>
                        <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border rounded-md focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-gray-700 text-sm font-semibold mb-1">To Date:</label>
                        <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border rounded-md focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                </div>
                {message && <p className="text-red-500 text-center mb-4">{message}</p>}
                <button onClick={handleSearch}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out">
                    Search
                </button>
            </div>

            {/* Search Results Display */}
            {startDate && endDate && (
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Search Results for {startDate} to {endDate}</h3>

                    <h4 className="text-lg font-semibold mt-6 mb-3 text-gray-700">Sales Records</h4>
                    <div className="overflow-x-auto rounded-md border border-gray-300 mb-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSales.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No sales found for this period.</td></tr>
                                ) : (
                                    filteredSales.map(sale => (
                                        <tr key={sale.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{sale.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{sale.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {sale.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">PKR {sale.grandTotal}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <h4 className="text-lg font-semibold mt-6 mb-3 text-gray-700">Recovery Records</h4>
                    <div className="overflow-x-auto rounded-md border border-gray-300 mb-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRecoveries.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No recoveries found for this period.</td></tr>
                                ) : (
                                    filteredRecoveries.map(rec => (
                                        <tr key={rec.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{rec.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{rec.source}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">PKR {rec.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{rec.description}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <h4 className="text-lg font-semibold mt-6 mb-3 text-gray-700">Expense Records</h4>
                    <div className="overflow-x-auto rounded-md border border-gray-300">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredExpenses.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No expenses found for this period.</td></tr>
                                ) : (
                                    filteredExpenses.map(exp => (
                                        <tr key={exp.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{exp.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{exp.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">PKR {exp.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{exp.description}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// Ensure Tailwind CSS is loaded
// This script tag will be automatically added by the environment if not present
// <script src="https://cdn.tailwindcss.com"></script>

// Add Inter font (or similar sans-serif)
// This will be handled by the environment's default font settings or can be added in index.html
// <style>
//   body { font-family: 'Inter', sans-serif; }
// </style>

export default App;
