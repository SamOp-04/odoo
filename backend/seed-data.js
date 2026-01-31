const bcrypt = require('bcryptjs');

const seedData = {
  users: [
    {
      _id: "507f1f77bcf86cd799439011",
      name: "John Doe",
      email: "john@customer.com",
      password: bcrypt.hashSync("password123", 10),
      role: "customer",
      company_name: "ABC Enterprises",
      gstin: "29ABCDE1234F1Z5",
      phone: "+91-9876543210",
      address: {
        line1: "123 Main Street",
        line2: "Near City Center",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India"
      },
      is_active: true,
      email_verified: true
    },
    {
      _id: "507f1f77bcf86cd799439012",
      name: "Jane Smith",
      email: "jane@vendor.com",
      password: bcrypt.hashSync("password123", 10),
      role: "vendor",
      company_name: "XYZ Rentals Pvt Ltd",
      gstin: "29XYZAB5678G1Z5",
      phone: "+91-9876543211",
      address: {
        line1: "456 Business Park",
        line2: "Sector 5",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        country: "India"
      },
      is_active: true,
      email_verified: true
    },
    {
      _id: "507f1f77bcf86cd799439013",
      name: "Admin User",
      email: "admin@rental.com",
      password: bcrypt.hashSync("admin123", 10),
      role: "admin",
      company_name: "Rental Management System",
      gstin: "29ADMIN1234H1Z5",
      phone: "+91-9876543212",
      is_active: true,
      email_verified: true
    },
    {
      _id: "507f1f77bcf86cd799439014",
      name: "Rajesh Kumar",
      email: "rajesh@customer.com",
      password: bcrypt.hashSync("password123", 10),
      role: "customer",
      company_name: "Tech Solutions India",
      gstin: "27PQRST7890I1Z5",
      phone: "+91-9876543213",
      address: {
        line1: "789 Tech Park",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
        country: "India"
      },
      is_active: true,
      email_verified: true
    }
  ],

  products: [
    {
      _id: "607f1f77bcf86cd799439021",
      vendor_id: "507f1f77bcf86cd799439012",
      name: "LED Projector 4K",
      description: "High-quality 4K LED projector for events and presentations",
      category: "Electronics",
      is_rentable: true,
      quantity_on_hand: 10,
      cost_price: 50000,
      sale_price: 75000,
      rental_pricing: {
        hourly: 500,
        daily: 2000,
        weekly: 12000,
        custom: {
          price: 40000,
          period_days: 30
        }
      },
      security_deposit: 5000,
      is_published: true,
      images: ["projector-1.jpg", "projector-2.jpg"],
      attributes: [
        { name: "Brand", value: "Sony" },
        { name: "Resolution", value: "4K UHD" },
        { name: "Brightness", value: "3000 lumens" }
      ],
      variants: [
        {
          sku: "PROJ-4K-01",
          name: "Standard",
          quantity: 6,
          price_adjustment: 0,
          attributes: [{ name: "Color", value: "Black" }]
        },
        {
          sku: "PROJ-4K-02",
          name: "Premium",
          quantity: 4,
          price_adjustment: 500,
          attributes: [{ name: "Color", value: "White" }]
        }
      ]
    },
    {
      _id: "607f1f77bcf86cd799439022",
      vendor_id: "507f1f77bcf86cd799439012",
      name: "Conference Table",
      description: "Large wooden conference table for 12 people",
      category: "Furniture",
      is_rentable: true,
      quantity_on_hand: 5,
      cost_price: 30000,
      sale_price: 50000,
      rental_pricing: {
        daily: 1000,
        weekly: 6000,
        custom: {
          price: 20000,
          period_days: 30
        }
      },
      security_deposit: 3000,
      is_published: true,
      images: ["table-1.jpg"],
      attributes: [
        { name: "Material", value: "Solid Wood" },
        { name: "Capacity", value: "12 People" }
      ]
    },
    {
      _id: "607f1f77bcf86cd799439023",
      vendor_id: "507f1f77bcf86cd799439012",
      name: "Sound System",
      description: "Professional PA system with speakers and mixer",
      category: "Electronics",
      is_rentable: true,
      quantity_on_hand: 8,
      cost_price: 80000,
      sale_price: 120000,
      rental_pricing: {
        hourly: 800,
        daily: 3000,
        weekly: 18000
      },
      security_deposit: 8000,
      is_published: true,
      images: ["sound-1.jpg", "sound-2.jpg"],
      attributes: [
        { name: "Brand", value: "Bose" },
        { name: "Power", value: "2000W" }
      ]
    },
    {
      _id: "607f1f77bcf86cd799439024",
      vendor_id: "507f1f77bcf86cd799439012",
      name: "Laptop Dell XPS",
      description: "High-performance laptop for business use",
      category: "Electronics",
      is_rentable: true,
      quantity_on_hand: 15,
      cost_price: 100000,
      sale_price: 140000,
      rental_pricing: {
        daily: 800,
        weekly: 5000,
        custom: {
          price: 18000,
          period_days: 30
        }
      },
      security_deposit: 10000,
      is_published: true,
      images: ["laptop-1.jpg"],
      attributes: [
        { name: "Brand", value: "Dell" },
        { name: "Processor", value: "Intel i7" },
        { name: "RAM", value: "16GB" }
      ]
    }
  ],

  productAttributes: [
    {
      name: "Brand",
      values: ["Sony", "Dell", "HP", "Bose", "Canon"]
    },
    {
      name: "Color",
      values: ["Black", "White", "Silver", "Gray"]
    },
    {
      name: "Size",
      values: ["Small", "Medium", "Large", "Extra Large"]
    }
  ],

  quotations: [
    {
      _id: "707f1f77bcf86cd799439031",
      customer_id: "507f1f77bcf86cd799439011",
      quotation_number: "QUOT-1738310400000-123",
      status: "confirmed",
      lines: [
        {
          product_id: "607f1f77bcf86cd799439021",
          variant_id: null,
          quantity: 2,
          rental_start_date: new Date("2026-02-01"),
          rental_end_date: new Date("2026-02-05"),
          rental_duration_type: "daily",
          rental_duration_value: 4,
          unit_price: 2000,
          subtotal: 16000
        }
      ],
      total_amount: 16000,
      deposit_amount: 10000,
      notes: "Required for corporate event",
      valid_until: new Date("2026-02-15")
    },
    {
      _id: "707f1f77bcf86cd799439032",
      customer_id: "507f1f77bcf86cd799439014",
      quotation_number: "QUOT-1738310400001-456",
      status: "draft",
      lines: [
        {
          product_id: "607f1f77bcf86cd799439024",
          variant_id: null,
          quantity: 5,
          rental_start_date: new Date("2026-02-10"),
          rental_end_date: new Date("2026-02-17"),
          rental_duration_type: "weekly",
          rental_duration_value: 1,
          unit_price: 5000,
          subtotal: 25000
        }
      ],
      total_amount: 25000,
      deposit_amount: 50000,
      notes: "For training program",
      valid_until: new Date("2026-02-28")
    }
  ],

  rentalOrders: [
    {
      _id: "807f1f77bcf86cd799439041",
      quotation_id: "707f1f77bcf86cd799439031",
      customer_id: "507f1f77bcf86cd799439011",
      vendor_id: "507f1f77bcf86cd799439012",
      order_number: "ORD-1738310400000-789",
      status: "with_customer",
      lines: [
        {
          product_id: "607f1f77bcf86cd799439021",
          product_name: "LED Projector 4K",
          variant_id: null,
          quantity: 2,
          rental_start_date: new Date("2026-02-01"),
          rental_end_date: new Date("2026-02-05"),
          unit_price: 2000,
          subtotal: 16000
        }
      ],
      total_amount: 16000,
      deposit_paid: 10000,
      full_payment_made: false,
      payment_status: "partial",
      pickup_date: new Date("2026-02-01T10:00:00"),
      return_date: new Date("2026-02-05"),
      actual_return_date: null,
      late_fee: 0,
      notes: "Picked up on time"
    },
    {
      _id: "807f1f77bcf86cd799439042",
      quotation_id: null,
      customer_id: "507f1f77bcf86cd799439014",
      vendor_id: "507f1f77bcf86cd799439012",
      order_number: "ORD-1738310400001-101",
      status: "confirmed",
      lines: [
        {
          product_id: "607f1f77bcf86cd799439023",
          product_name: "Sound System",
          variant_id: null,
          quantity: 1,
          rental_start_date: new Date("2026-02-15"),
          rental_end_date: new Date("2026-02-16"),
          unit_price: 3000,
          subtotal: 3000
        }
      ],
      total_amount: 3000,
      deposit_paid: 8000,
      full_payment_made: true,
      payment_status: "paid",
      pickup_date: null,
      return_date: new Date("2026-02-16"),
      actual_return_date: null,
      late_fee: 0,
      notes: "Wedding event"
    }
  ],

  reservations: [
    {
      product_id: "607f1f77bcf86cd799439021",
      variant_id: null,
      order_id: "807f1f77bcf86cd799439041",
      quantity_reserved: 2,
      start_date: new Date("2026-02-01"),
      end_date: new Date("2026-02-05"),
      status: "active"
    },
    {
      product_id: "607f1f77bcf86cd799439023",
      variant_id: null,
      order_id: "807f1f77bcf86cd799439042",
      quantity_reserved: 1,
      start_date: new Date("2026-02-15"),
      end_date: new Date("2026-02-16"),
      status: "active"
    }
  ],

  invoices: [
    {
      _id: "907f1f77bcf86cd799439051",
      order_id: "807f1f77bcf86cd799439041",
      invoice_number: "INV-1738310400000-555",
      customer_id: "507f1f77bcf86cd799439011",
      vendor_id: "507f1f77bcf86cd799439012",
      invoice_date: new Date("2026-02-01"),
      due_date: new Date("2026-02-08"),
      lines: [
        {
          description: "Rental: LED Projector 4K",
          quantity: 2,
          unit_price: 2000,
          subtotal: 16000,
          tax_rate: 18,
          tax_amount: 2880,
          total: 18880
        }
      ],
      subtotal: 16000,
      tax_rate: 18,
      tax_amount: 2880,
      total_amount: 18880,
      amount_paid: 10000,
      amount_due: 8880,
      status: "sent",
      payment_method: null,
      gstin_customer: "29ABCDE1234F1Z5",
      gstin_vendor: "29XYZAB5678G1Z5",
      pdf_url: null
    },
    {
      _id: "907f1f77bcf86cd799439052",
      order_id: "807f1f77bcf86cd799439042",
      invoice_number: "INV-1738310400001-666",
      customer_id: "507f1f77bcf86cd799439014",
      vendor_id: "507f1f77bcf86cd799439012",
      invoice_date: new Date("2026-02-15"),
      due_date: new Date("2026-02-22"),
      lines: [
        {
          description: "Rental: Sound System",
          quantity: 1,
          unit_price: 3000,
          subtotal: 3000,
          tax_rate: 18,
          tax_amount: 540,
          total: 3540
        }
      ],
      subtotal: 3000,
      tax_rate: 18,
      tax_amount: 540,
      total_amount: 3540,
      amount_paid: 3540,
      amount_due: 0,
      status: "paid",
      payment_method: "upi",
      gstin_customer: "27PQRST7890I1Z5",
      gstin_vendor: "29XYZAB5678G1Z5",
      pdf_url: null
    }
  ],

  payments: [
    {
      invoice_id: "907f1f77bcf86cd799439051",
      order_id: "807f1f77bcf86cd799439041",
      customer_id: "507f1f77bcf86cd799439011",
      amount: 10000,
      payment_method: "cash",
      payment_status: "success",
      transaction_id: "TXN-1738310400000-abc123",
      payment_date: new Date("2026-02-01T10:30:00"),
      notes: "Deposit payment"
    },
    {
      invoice_id: "907f1f77bcf86cd799439052",
      order_id: "807f1f77bcf86cd799439042",
      customer_id: "507f1f77bcf86cd799439014",
      amount: 3540,
      payment_method: "upi",
      payment_status: "success",
      transaction_id: "TXN-1738310400001-xyz789",
      payment_date: new Date("2026-02-15T09:00:00"),
      notes: "Full payment"
    }
  ],

  pickupDocuments: [
    {
      order_id: "807f1f77bcf86cd799439041",
      pickup_number: "PICKUP-1738310400000",
      pickup_date: new Date("2026-02-01T10:00:00"),
      pickup_instructions: "Handle with care, check all cables",
      verified_by: "507f1f77bcf86cd799439012",
      status: "completed"
    }
  ],

  returnDocuments: [],

  notifications: [
    {
      user_id: "507f1f77bcf86cd799439011",
      type: "order_confirmed",
      title: "Order Confirmed",
      message: "Your rental order ORD-1738310400000-789 has been confirmed",
      is_read: true,
      related_order: "807f1f77bcf86cd799439041"
    },
    {
      user_id: "507f1f77bcf86cd799439011",
      type: "pickup_reminder",
      title: "Order Picked Up",
      message: "Your order ORD-1738310400000-789 has been picked up",
      is_read: true,
      related_order: "807f1f77bcf86cd799439041"
    },
    {
      user_id: "507f1f77bcf86cd799439011",
      type: "return_due",
      title: "Return Due Soon",
      message: "Your order ORD-1738310400000-789 is due for return on 2026-02-05",
      is_read: false,
      related_order: "807f1f77bcf86cd799439041"
    },
    {
      user_id: "507f1f77bcf86cd799439014",
      type: "payment_success",
      title: "Payment Successful",
      message: "Payment of ₹3540 received successfully",
      is_read: true,
      related_order: "807f1f77bcf86cd799439042"
    }
  ],

  coupons: [
    {
      code: "FIRST10",
      description: "10% off on first rental",
      discount_type: "percentage",
      discount_value: 10,
      min_order_value: 5000,
      max_uses: 100,
      used_count: 15,
      valid_from: new Date("2026-01-01"),
      valid_until: new Date("2026-12-31"),
      is_active: true
    },
    {
      code: "WEEKEND500",
      description: "Flat ₹500 off on weekend rentals",
      discount_type: "fixed",
      discount_value: 500,
      min_order_value: 3000,
      max_uses: 50,
      used_count: 8,
      valid_from: new Date("2026-01-01"),
      valid_until: new Date("2026-06-30"),
      is_active: true
    }
  ],

  settings: [
    {
      key: "gst_rate",
      value: 18,
      data_type: "number",
      description: "GST percentage rate"
    },
    {
      key: "late_fee_per_day",
      value: 100,
      data_type: "number",
      description: "Late fee charged per day"
    },
    {
      key: "company_name",
      value: "Rental Management System",
      data_type: "string",
      description: "Company name for invoices"
    },
    {
      key: "support_email",
      value: "support@rental.com",
      data_type: "string",
      description: "Support email address"
    }
  ]
};

module.exports = seedData;