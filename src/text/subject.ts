const FirstSemester = new Map<number, string>([
    [21011, "Engineering Drawing"],
    [25711, "Bangla-I"],
    [25712, "English-I"],
    [25911, "Mathematics-I"],
    [25912, "Physics-I"],
    [28511, "Computer Office Application"],
    [26711, "Basic Electricity"]
])

const SecondSemester = new Map<number, string>([
    [25721, "Bangla-II"],
    [25722, "English-II"],
    [25812, "Physical Education & Life skills Development"],
    [25913, "Chemistry"],
    [25921, "Mathematics-II"],
    [28521, "Python Programming"],
    [28522, "Computer Graphics Design-I"],
    [26811, "Basic Electronics"]
])

const ThirdSemester = new Map<number, string>([
    [25811, "Social Science"],
    [25922, "Physics-II"],
    [25931, "Mathematics-III"],
    [28531, "Application Development Using Python"],
    [28532, "Computer Graphics Design-II"],
    [28533, "IT Support Services"],
    [26831, "Digital Electronics-I"]
])

const FourthSemester = new Map<number, string>([
    [25831, "Business Communication"],
    [28541, "Java Programming"],
    [28542, "Data Structure & Algorithm"],
    [28543, "Computer Peripherals & Interfacing"],
    [28544, "Web Design & Development-I"],
    [26841, "Digital Electronics-II"],
    [29041, "Environmental Studies"]
])

const FifthSemester = new Map<number, string>([
    [25841, "Accounting"],
    [28551, "Application Development Using Java"],
    [28552, "Web Design & Development-II"],
    [28553, "Computer Architecture & Microprocessor"],
    [28554, "Data Communication"],
    [28555, "Operating System"],
    [28556, "Project Work-I"]
])

const SixthSemester = new Map<number, string>([
    [25851, "Principles of Marketing"],
    [25852, "Industrial Management"],
    [28561, "Database Management System"],
    [28562, "Computer Networking"],
    [28563, "Sensor & IoT System"],
    [28564, "Microcontroller Based System Design & Development"],
    [28565, "Surveillance Security System"],
    [28566, "Web Development Project"]
])

const SeventhSemester = new Map<number, string>([
    [25853, "Innovation & Entrepreneurship"],
    [28571, "Digital Marketing Technique"],
    [28572, "Network Administration & Services"],
    [28573, "Cyber Security & Ethics"],
    [28574, "Apps Development Project"],
    [28575, "Multimedia & Animation"],
    [28576, "Project Work-II"]
])

export const Subject = new Map<Semester, DepartmentBooks>([
    [1, FirstSemester],
    [2, SecondSemester],
    [3, ThirdSemester],
    [4, FourthSemester],
    [5, FifthSemester],
    [6, SixthSemester],
    [7, SeventhSemester]
])

export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type DepartmentBooks = Map<number, string>

export type ReadOnlyDepartment = {
    readonly name: string
    readonly code: number
}

export type Department = ReadOnlyDepartment & { books: Map<Semester, DepartmentBooks> }
