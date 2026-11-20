
#include <iostream>
#include <string>
#include <cctype>

using namespace std;

int main() {

    string password;

    cout << "===== SECURECHECK ENGINE =====\n";

    cout << "Enter password: ";
    cin >> password;

    bool uppercase = false;
    bool lowercase = false;
    bool number = false;
    bool special = false;

    for (char ch : password) {

        unsigned char c = static_cast<unsigned char>(ch);

        if (isupper(c))
            uppercase = true;

        else if (islower(c))
            lowercase = true;

        else if (isdigit(c))
            number = true;

        else
            special = true;
    }

    int score = 0;

    if (password.length() >= 12)
        score++;

    if (uppercase)
        score++;

    if (lowercase)
        score++;

    if (number)
        score++;

    if (special)
        score++;

    cout << "\n===== ANALYSIS =====\n";

    cout << "Length: " << password.length() << endl;

    cout << "Uppercase: " << (uppercase ? "Yes" : "No") << endl;

    cout << "Lowercase: " << (lowercase ? "Yes" : "No") << endl;

    cout << "Numbers: " << (number ? "Yes" : "No") << endl;

    cout << "Special Characters: " << (special ? "Yes" : "No") << endl;

    cout << "Security Score: " << score << "/5" << endl;

    return 0;
}
