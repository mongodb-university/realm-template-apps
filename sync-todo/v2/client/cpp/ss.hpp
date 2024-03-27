#ifndef SS_HPP
#define SS_HPP

#include <sstream>
#include <iostream>

// usage:   SS("xyz" << 123 << 45.6) returning a std::string rvalue.
#define SS(x) ( ((std::stringstream&)(std::stringstream() << x )).str())

#endif