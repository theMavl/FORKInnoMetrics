print("AAAAAAAAAAa")
db.createUser(
        {
            user: "manager",
            pwd: "123456",
            roles: [
                {
                    role: "readWrite",
                    db: "metrics"
                }
            ]
        }
);
print("BBBBBBBB")
db.DUMMY.insert({ some_key: "some_value" });